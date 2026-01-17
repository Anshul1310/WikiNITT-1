package articles

import (
	"context"
	"time"

	"github.com/pranava-mohan/wikinitt/gravy/internal/users"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type Article struct {
	ID        string            `bson:"_id,omitempty"`
	Title     string            `bson:"title"`
	Content   string            `bson:"content"`
	Slug      string            `bson:"slug"`
	Category  string            `bson:"category"`
	Thumbnail string            `bson:"thumbnail"`
	Featured  bool              `bson:"featured"`
	AuthorID  string            `bson:"authorId"`
	CreatedAt time.Time         `bson:"createdAt"`
	UpdatedAt time.Time         `bson:"updatedAt"`
	Author    *users.PublicUser `bson:"-"`
}

type Repository interface {
	Create(ctx context.Context, article Article) (*Article, error)
	Update(ctx context.Context, id string, updates bson.M) (*Article, error)
	Delete(ctx context.Context, id string) error
	GetByID(ctx context.Context, id string) (*Article, error)
	List(ctx context.Context, category *string, limit *int, offset *int, featured *bool) ([]*Article, error)
	GetBySlug(ctx context.Context, slug string) (*Article, error)
}

type repository struct {
	coll *mongo.Collection
}

func NewRepository(db *mongo.Database) Repository {
	return &repository{
		coll: db.Collection("articles"),
	}
}

func (r *repository) Create(ctx context.Context, article Article) (*Article, error) {
	article.CreatedAt = time.Now()
	article.UpdatedAt = time.Now()
	res, err := r.coll.InsertOne(ctx, article)
	if err != nil {
		return nil, err
	}
	article.ID = res.InsertedID.(bson.ObjectID).Hex()
	return &article, nil
}

func (r *repository) Update(ctx context.Context, id string, updates bson.M) (*Article, error) {
	idObj, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	updates["updatedAt"] = time.Now()
	res := r.coll.FindOneAndUpdate(ctx, bson.M{"_id": idObj}, bson.M{"$set": updates})
	if res.Err() != nil {
		return nil, res.Err()
	}
	var article Article
	if err := res.Decode(&article); err != nil {
		return nil, err
	}
	return r.GetByID(ctx, id)
}

func (r *repository) Delete(ctx context.Context, id string) error {
	idObj, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	_, err = r.coll.DeleteOne(ctx, bson.M{"_id": idObj})
	return err
}

func (r *repository) GetByID(ctx context.Context, id string) (*Article, error) {
	var article Article
	idObj, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	err = r.coll.FindOne(ctx, bson.M{"_id": idObj}).Decode(&article)
	if err != nil {
		return nil, err
	}
	return &article, nil
}

func (r *repository) List(ctx context.Context, category *string, limit *int, offset *int, featured *bool) ([]*Article, error) {
	filter := bson.M{}
	if category != nil {
		filter["category"] = *category
	}
	if featured != nil {
		filter["featured"] = *featured
	}

	opts := options.Find()
	if limit != nil {
		opts.SetLimit(int64(*limit))
	}
	if offset != nil {
		opts.SetSkip(int64(*offset))
	}
	opts.SetSort(bson.D{{Key: "createdAt", Value: -1}})

	cursor, err := r.coll.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	var articles []*Article
	if err := cursor.All(ctx, &articles); err != nil {
		return nil, err
	}
	return articles, nil
}

func (r *repository) GetBySlug(ctx context.Context, slug string) (*Article, error) {
	var article Article
	err := r.coll.FindOne(ctx, bson.M{"slug": slug}).Decode(&article)
	if err != nil {
		return nil, err
	}
	return &article, nil
}
