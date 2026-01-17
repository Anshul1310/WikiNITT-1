package community

import (
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type Repository interface {
	CreateGroup(ctx context.Context, group *Group) error
	GetGroup(ctx context.Context, slug string) (*Group, error)
	GetGroupByID(ctx context.Context, id string) (*Group, error)
	ListGroups(ctx context.Context, filter GroupFilter, limit, offset int) ([]*Group, error)
	JoinGroup(ctx context.Context, groupID, userID string) error
	LeaveGroup(ctx context.Context, groupID, userID string) error
	DeleteGroup(ctx context.Context, groupID string) error
	IsMember(ctx context.Context, groupID, userID string) (bool, error)
	ListGroupsByMember(ctx context.Context, userID string) ([]*Group, error)

	CreatePost(ctx context.Context, post *Post) error
	GetPost(ctx context.Context, id string) (*Post, error)
	ListPosts(ctx context.Context, groupID string, limit, offset int) ([]*Post, error)
	ListPublicPosts(ctx context.Context, limit, offset int) ([]*Post, error)
	ListPostsByAuthor(ctx context.Context, authorID string, limit, offset int) ([]*Post, error)

	CreateComment(ctx context.Context, comment *Comment) error
	GetComment(ctx context.Context, id string) (*Comment, error)
	ListComments(ctx context.Context, postID string, parentID *string, limit, offset int) ([]*Comment, error)
	ListReplies(ctx context.Context, parentID string, limit, offset int) ([]*Comment, error)
	ListCommentsByAuthor(ctx context.Context, authorID string, limit, offset int) ([]*Comment, error)

	VotePost(ctx context.Context, userID, postID string, voteType string) error
	GetUserVote(ctx context.Context, userID, postID string) (string, error)
	VoteComment(ctx context.Context, userID, commentID string, voteType string) error
	GetUserCommentVote(ctx context.Context, userID, commentID string) (string, error)

	GetDiscussionByGroup(ctx context.Context, groupID string) (*Discussion, error)
	GetDiscussion(ctx context.Context, id string) (*Discussion, error)
	CreateDiscussion(ctx context.Context, discussion *Discussion) error

	CreateChannel(ctx context.Context, channel *Channel) error
	GetChannel(ctx context.Context, id string) (*Channel, error)
	ListChannels(ctx context.Context, discussionID string) ([]*Channel, error)

	CreateMessage(ctx context.Context, message *Message) error
	ListMessages(ctx context.Context, channelID string, limit, offset int) ([]*Message, error)
}

type repository struct {
	db *mongo.Database
}

func NewRepository(db *mongo.Database) Repository {
	return &repository{db: db}
}

func (r *repository) CreateGroup(ctx context.Context, group *Group) error {
	res, err := r.db.Collection("groups").InsertOne(ctx, group)
	if err != nil {
		return err
	}
	if oid, ok := res.InsertedID.(bson.ObjectID); ok {
		group.ID = oid.Hex()
	}
	return nil
}

func (r *repository) GetGroup(ctx context.Context, slug string) (*Group, error) {
	var group Group
	err := r.db.Collection("groups").FindOne(ctx, bson.M{"slug": slug}).Decode(&group)
	if err != nil {
		return nil, err
	}
	return &group, nil
}

func (r *repository) GetGroupByID(ctx context.Context, id string) (*Group, error) {
	var group Group
	oid, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	err = r.db.Collection("groups").FindOne(ctx, bson.M{"_id": oid}).Decode(&group)
	if err != nil {
		return nil, err
	}
	return &group, nil
}

func (r *repository) ListGroups(ctx context.Context, filter GroupFilter, limit, offset int) ([]*Group, error) {
	query := bson.M{}
	if filter.OwnerID != nil {
		query["ownerId"] = *filter.OwnerID
	}
	if filter.Type != nil {
		query["type"] = *filter.Type
	}

	opts := options.Find().SetLimit(int64(limit)).SetSkip(int64(offset))
	cursor, err := r.db.Collection("groups").Find(ctx, query, opts)
	if err != nil {
		return nil, err
	}
	var groups []*Group
	if err := cursor.All(ctx, &groups); err != nil {
		return nil, err
	}
	return groups, nil
}

func (r *repository) JoinGroup(ctx context.Context, groupID, userID string) error {
	oid, err := bson.ObjectIDFromHex(groupID)
	if err != nil {
		return err
	}

	_, err = r.db.Collection("groups").UpdateOne(ctx, bson.M{"_id": oid}, bson.M{
		"$addToSet": bson.M{"memberIds": userID},
		"$inc":      bson.M{"membersCount": 1},
	})
	return err
}

func (r *repository) LeaveGroup(ctx context.Context, groupID, userID string) error {
	oid, err := bson.ObjectIDFromHex(groupID)
	if err != nil {
		return err
	}

	_, err = r.db.Collection("groups").UpdateOne(ctx, bson.M{"_id": oid}, bson.M{
		"$pull": bson.M{"memberIds": userID},
		"$inc":  bson.M{"membersCount": -1},
	})
	return err
}

func (r *repository) IsMember(ctx context.Context, groupID, userID string) (bool, error) {
	oid, err := bson.ObjectIDFromHex(groupID)
	if err != nil {
		return false, err
	}
	count, err := r.db.Collection("groups").CountDocuments(ctx, bson.M{
		"_id":       oid,
		"memberIds": userID,
	})
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *repository) DeleteGroup(ctx context.Context, groupID string) error {
	oid, err := bson.ObjectIDFromHex(groupID)
	if err != nil {
		return err
	}

	_, err = r.db.Collection("groups").DeleteOne(ctx, bson.M{"_id": oid})
	if err != nil {
		return err
	}

	cursorPosts, err := r.db.Collection("posts").Find(ctx, bson.M{"groupId": groupID})
	if err == nil {
		var posts []*Post
		if err := cursorPosts.All(ctx, &posts); err == nil {
			var postIDs []string
			for _, p := range posts {
				postIDs = append(postIDs, p.ID)
			}
			if len(postIDs) > 0 {

				_, err = r.db.Collection("comments").DeleteMany(ctx, bson.M{"postId": bson.M{"$in": postIDs}})
				if err != nil {
					return err
				}

				_, err = r.db.Collection("votes").DeleteMany(ctx, bson.M{"postId": bson.M{"$in": postIDs}})
				if err != nil {
					return err
				}
			}
		}
	}

	_, err = r.db.Collection("posts").DeleteMany(ctx, bson.M{"groupId": groupID})
	if err != nil {
		return err
	}

	var discussion Discussion
	err = r.db.Collection("discussions").FindOne(ctx, bson.M{"groupId": groupID}).Decode(&discussion)
	if err == nil {

		discOid, _ := bson.ObjectIDFromHex(discussion.ID)
		_, _ = r.db.Collection("discussions").DeleteOne(ctx, bson.M{"_id": discOid})

		cursor, err := r.db.Collection("channels").Find(ctx, bson.M{"discussionId": discussion.ID})
		if err == nil {
			var channels []*Channel
			if err := cursor.All(ctx, &channels); err == nil {
				for _, ch := range channels {

					_, _ = r.db.Collection("messages").DeleteMany(ctx, bson.M{"channelId": ch.ID})
				}
			}
		}

		_, _ = r.db.Collection("channels").DeleteMany(ctx, bson.M{"discussionId": discussion.ID})
	}

	return nil
}

func (r *repository) ListGroupsByMember(ctx context.Context, userID string) ([]*Group, error) {
	filter := bson.M{
		"memberIds": userID,
		"type":      "PUBLIC",
	}
	cursor, err := r.db.Collection("groups").Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	var groups []*Group
	if err := cursor.All(ctx, &groups); err != nil {
		return nil, err
	}
	return groups, nil
}

func (r *repository) CreatePost(ctx context.Context, post *Post) error {
	res, err := r.db.Collection("posts").InsertOne(ctx, post)
	if err != nil {
		return err
	}
	if oid, ok := res.InsertedID.(bson.ObjectID); ok {
		post.ID = oid.Hex()
	}
	return nil
}

func (r *repository) GetPost(ctx context.Context, id string) (*Post, error) {
	var post Post
	oid, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	err = r.db.Collection("posts").FindOne(ctx, bson.M{"_id": oid}).Decode(&post)
	if err != nil {
		return nil, err
	}
	return &post, nil
}

func (r *repository) ListPosts(ctx context.Context, groupID string, limit, offset int) ([]*Post, error) {
	opts := options.Find().SetLimit(int64(limit)).SetSkip(int64(offset)).SetSort(bson.M{"createdAt": -1})
	cursor, err := r.db.Collection("posts").Find(ctx, bson.M{"groupId": groupID}, opts)
	if err != nil {
		return nil, err
	}
	var posts []*Post
	if err := cursor.All(ctx, &posts); err != nil {
		return nil, err
	}
	return posts, nil
}

func (r *repository) ListPublicPosts(ctx context.Context, limit, offset int) ([]*Post, error) {

	pipeline := mongo.Pipeline{

		{{Key: "$lookup", Value: bson.M{
			"from":         "groups",
			"localField":   "groupId",
			"foreignField": "_id",
			"as":           "group_info",
		}}},
	}
	_ = pipeline

	cursorGroups, err := r.db.Collection("groups").Find(ctx, bson.M{"type": "PUBLIC"}, options.Find().SetProjection(bson.M{"_id": 1}))
	if err != nil {
		return nil, err
	}

	var rawGroups []bson.M
	if err := cursorGroups.All(ctx, &rawGroups); err != nil {
		return nil, err
	}

	var publicGroupIDs []string
	for _, rg := range rawGroups {
		if oid, ok := rg["_id"].(bson.ObjectID); ok {
			publicGroupIDs = append(publicGroupIDs, oid.Hex())
		} else if sid, ok := rg["_id"].(string); ok {
			publicGroupIDs = append(publicGroupIDs, sid)
		}
	}

	if len(publicGroupIDs) == 0 {
		return []*Post{}, nil
	}

	opts := options.Find().SetLimit(int64(limit)).SetSkip(int64(offset)).SetSort(bson.M{"createdAt": -1})
	cursor, err := r.db.Collection("posts").Find(ctx, bson.M{"groupId": bson.M{"$in": publicGroupIDs}}, opts)
	if err != nil {
		return nil, err
	}
	var posts []*Post
	if err := cursor.All(ctx, &posts); err != nil {
		return nil, err
	}
	return posts, nil
}

func (r *repository) ListPostsByAuthor(ctx context.Context, authorID string, limit, offset int) ([]*Post, error) {
	opts := options.Find().SetLimit(int64(limit)).SetSkip(int64(offset)).SetSort(bson.M{"createdAt": -1})
	cursor, err := r.db.Collection("posts").Find(ctx, bson.M{"authorId": authorID}, opts)
	if err != nil {
		return nil, err
	}
	var posts []*Post
	if err := cursor.All(ctx, &posts); err != nil {
		return nil, err
	}
	return posts, nil
}

func (r *repository) CreateComment(ctx context.Context, comment *Comment) error {
	res, err := r.db.Collection("comments").InsertOne(ctx, comment)
	if err != nil {
		return err
	}
	if oid, ok := res.InsertedID.(bson.ObjectID); ok {
		comment.ID = oid.Hex()
	}

	postOid, _ := bson.ObjectIDFromHex(comment.PostID)
	_, _ = r.db.Collection("posts").UpdateOne(ctx, bson.M{"_id": postOid}, bson.M{"$inc": bson.M{"commentsCount": 1}})

	if comment.ParentID != nil {
		parentOid, err := bson.ObjectIDFromHex(*comment.ParentID)
		if err == nil {
			_, _ = r.db.Collection("comments").UpdateOne(ctx, bson.M{"_id": parentOid}, bson.M{"$inc": bson.M{"repliesCount": 1}})
		}
	}
	return nil
}

func (r *repository) GetComment(ctx context.Context, id string) (*Comment, error) {
	var comment Comment
	oid, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	err = r.db.Collection("comments").FindOne(ctx, bson.M{"_id": oid}).Decode(&comment)
	if err != nil {
		return nil, err
	}
	return &comment, nil
}

func (r *repository) ListComments(ctx context.Context, postID string, parentID *string, limit, offset int) ([]*Comment, error) {
	filter := bson.M{"postId": postID}
	if parentID != nil {
		filter["parentId"] = *parentID
	} else {
		filter["parentId"] = nil
	}

	opts := options.Find().SetLimit(int64(limit)).SetSkip(int64(offset)).SetSort(bson.M{"createdAt": -1})
	cursor, err := r.db.Collection("comments").Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	var comments []*Comment
	if err := cursor.All(ctx, &comments); err != nil {
		return nil, err
	}
	return comments, nil
}

func (r *repository) ListReplies(ctx context.Context, parentID string, limit, offset int) ([]*Comment, error) {
	filter := bson.M{"parentId": parentID}

	opts := options.Find().SetLimit(int64(limit)).SetSkip(int64(offset)).SetSort(bson.M{"createdAt": 1})
	cursor, err := r.db.Collection("comments").Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	var comments []*Comment
	if err := cursor.All(ctx, &comments); err != nil {
		return nil, err
	}
	return comments, nil
}

func (r *repository) ListCommentsByAuthor(ctx context.Context, authorID string, limit, offset int) ([]*Comment, error) {
	opts := options.Find().SetLimit(int64(limit)).SetSkip(int64(offset)).SetSort(bson.M{"createdAt": -1})
	cursor, err := r.db.Collection("comments").Find(ctx, bson.M{"authorId": authorID}, opts)
	if err != nil {
		return nil, err
	}
	var comments []*Comment
	if err := cursor.All(ctx, &comments); err != nil {
		return nil, err
	}
	return comments, nil
}

func (r *repository) VotePost(ctx context.Context, userID, postID string, voteType string) error {

	var existingVote Vote
	err := r.db.Collection("votes").FindOne(ctx, bson.M{"userId": userID, "postId": postID}).Decode(&existingVote)
	fmt.Printf("VotePost: userID=%s, postID=%s, voteType=%s, err=%v, existingVote=%+v\n", userID, postID, voteType, err, existingVote)

	postOid, _ := bson.ObjectIDFromHex(postID)

	if err == mongo.ErrNoDocuments {

		if voteType == "NONE" {
			return nil
		}
		_, err := r.db.Collection("votes").InsertOne(ctx, bson.M{
			"userId":    userID,
			"postId":    postID,
			"type":      voteType,
			"createdAt": time.Now(),
		})
		if err != nil {
			return err
		}

		inc := bson.M{}
		if voteType == "UP" {
			inc["upvotesCount"] = 1
		} else {
			inc["downvotesCount"] = 1
		}
		_, _ = r.db.Collection("posts").UpdateOne(ctx, bson.M{"_id": postOid}, bson.M{"$inc": inc})

	} else if err == nil {

		if existingVote.Type == voteType {
			return nil
		}

		voteOid, err := bson.ObjectIDFromHex(existingVote.ID)
		if err != nil {
			return err
		}

		if voteType == "NONE" {

			_, err := r.db.Collection("votes").DeleteOne(ctx, bson.M{"_id": voteOid})
			if err != nil {
				return err
			}

			inc := bson.M{}
			if existingVote.Type == "UP" {
				inc["upvotesCount"] = -1
			} else {
				inc["downvotesCount"] = -1
			}
			_, _ = r.db.Collection("posts").UpdateOne(ctx, bson.M{"_id": postOid}, bson.M{"$inc": inc})

		} else {

			_, err := r.db.Collection("votes").UpdateOne(ctx, bson.M{"_id": voteOid}, bson.M{
				"$set": bson.M{"type": voteType},
			})
			if err != nil {
				return err
			}

			inc := bson.M{}

			if existingVote.Type == "UP" {
				inc["upvotesCount"] = -1
			} else {
				inc["downvotesCount"] = -1
			}

			if voteType == "UP" {
				if val, ok := inc["upvotesCount"]; ok {
					inc["upvotesCount"] = val.(int) + 1
				} else {
					inc["upvotesCount"] = 1
				}
			} else {
				if val, ok := inc["downvotesCount"]; ok {
					inc["downvotesCount"] = val.(int) + 1
				} else {
					inc["downvotesCount"] = 1
				}
			}
			_, _ = r.db.Collection("posts").UpdateOne(ctx, bson.M{"_id": postOid}, bson.M{"$inc": inc})
		}
	} else {
		return err
	}

	return nil
}

func (r *repository) GetUserVote(ctx context.Context, userID, postID string) (string, error) {
	var vote Vote
	err := r.db.Collection("votes").FindOne(ctx, bson.M{"userId": userID, "postId": postID}).Decode(&vote)
	fmt.Printf("GetUserVote: userID=%s, postID=%s, err=%v, vote=%+v\n", userID, postID, err, vote)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return "NONE", nil
		}
		return "NONE", err
	}
	return vote.Type, nil
}

func (r *repository) VoteComment(ctx context.Context, userID, commentID string, voteType string) error {

	var existingVote CommentVote
	err := r.db.Collection("commentVotes").FindOne(ctx, bson.M{"userId": userID, "commentId": commentID}).Decode(&existingVote)

	commentOid, _ := bson.ObjectIDFromHex(commentID)

	if err == mongo.ErrNoDocuments {

		if voteType == "NONE" {
			return nil
		}
		_, err := r.db.Collection("commentVotes").InsertOne(ctx, bson.M{
			"userId":    userID,
			"commentId": commentID,
			"type":      voteType,
			"createdAt": time.Now(),
		})
		if err != nil {
			return err
		}

		inc := bson.M{}
		if voteType == "UP" {
			inc["upvotesCount"] = 1
		} else {
			inc["downvotesCount"] = 1
		}
		_, _ = r.db.Collection("comments").UpdateOne(ctx, bson.M{"_id": commentOid}, bson.M{"$inc": inc})

	} else if err == nil {

		if existingVote.Type == voteType {
			return nil
		}

		voteOid, err := bson.ObjectIDFromHex(existingVote.ID)
		if err != nil {
			return err
		}

		if voteType == "NONE" {

			_, err := r.db.Collection("commentVotes").DeleteOne(ctx, bson.M{"_id": voteOid})
			if err != nil {
				return err
			}

			inc := bson.M{}
			if existingVote.Type == "UP" {
				inc["upvotesCount"] = -1
			} else {
				inc["downvotesCount"] = -1
			}
			_, _ = r.db.Collection("comments").UpdateOne(ctx, bson.M{"_id": commentOid}, bson.M{"$inc": inc})

		} else {

			_, err := r.db.Collection("commentVotes").UpdateOne(ctx, bson.M{"_id": voteOid}, bson.M{
				"$set": bson.M{"type": voteType},
			})
			if err != nil {
				return err
			}

			inc := bson.M{}

			if existingVote.Type == "UP" {
				inc["upvotesCount"] = -1
			} else {
				inc["downvotesCount"] = -1
			}

			if voteType == "UP" {
				if val, ok := inc["upvotesCount"]; ok {
					inc["upvotesCount"] = val.(int) + 1
				} else {
					inc["upvotesCount"] = 1
				}
			} else {
				if val, ok := inc["downvotesCount"]; ok {
					inc["downvotesCount"] = val.(int) + 1
				} else {
					inc["downvotesCount"] = 1
				}
			}
			_, _ = r.db.Collection("comments").UpdateOne(ctx, bson.M{"_id": commentOid}, bson.M{"$inc": inc})
		}
	} else {
		return err
	}

	return nil
}

func (r *repository) GetUserCommentVote(ctx context.Context, userID, commentID string) (string, error) {
	var vote CommentVote
	err := r.db.Collection("commentVotes").FindOne(ctx, bson.M{"userId": userID, "commentId": commentID}).Decode(&vote)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return "NONE", nil
		}
		return "NONE", err
	}
	return vote.Type, nil
}

func (r *repository) GetDiscussionByGroup(ctx context.Context, groupID string) (*Discussion, error) {
	var discussion Discussion
	err := r.db.Collection("discussions").FindOne(ctx, bson.M{"groupId": groupID}).Decode(&discussion)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	return &discussion, nil
}

func (r *repository) GetDiscussion(ctx context.Context, id string) (*Discussion, error) {
	var discussion Discussion
	oid, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	err = r.db.Collection("discussions").FindOne(ctx, bson.M{"_id": oid}).Decode(&discussion)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	return &discussion, nil
}

func (r *repository) CreateDiscussion(ctx context.Context, discussion *Discussion) error {
	res, err := r.db.Collection("discussions").InsertOne(ctx, discussion)
	if err != nil {
		return err
	}
	if oid, ok := res.InsertedID.(bson.ObjectID); ok {
		discussion.ID = oid.Hex()
	}
	return nil
}

func (r *repository) CreateChannel(ctx context.Context, channel *Channel) error {
	res, err := r.db.Collection("channels").InsertOne(ctx, channel)
	if err != nil {
		return err
	}
	if oid, ok := res.InsertedID.(bson.ObjectID); ok {
		channel.ID = oid.Hex()
	}
	return nil
}

func (r *repository) GetChannel(ctx context.Context, id string) (*Channel, error) {
	var channel Channel
	oid, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	err = r.db.Collection("channels").FindOne(ctx, bson.M{"_id": oid}).Decode(&channel)
	if err != nil {
		return nil, err
	}
	return &channel, nil
}

func (r *repository) ListChannels(ctx context.Context, discussionID string) ([]*Channel, error) {
	cursor, err := r.db.Collection("channels").Find(ctx, bson.M{"discussionId": discussionID})
	if err != nil {
		return nil, err
	}
	var channels []*Channel
	if err := cursor.All(ctx, &channels); err != nil {
		return nil, err
	}
	return channels, nil
}

func (r *repository) CreateMessage(ctx context.Context, message *Message) error {
	res, err := r.db.Collection("messages").InsertOne(ctx, message)
	if err != nil {
		return err
	}
	if oid, ok := res.InsertedID.(bson.ObjectID); ok {
		message.ID = oid.Hex()
	}
	return nil
}

func (r *repository) ListMessages(ctx context.Context, channelID string, limit, offset int) ([]*Message, error) {
	opts := options.Find().SetLimit(int64(limit)).SetSkip(int64(offset)).SetSort(bson.M{"createdAt": 1})
	cursor, err := r.db.Collection("messages").Find(ctx, bson.M{"channelId": channelID}, opts)
	if err != nil {
		return nil, err
	}
	var messages []*Message
	if err := cursor.All(ctx, &messages); err != nil {
		return nil, err
	}
	return messages, nil
}
