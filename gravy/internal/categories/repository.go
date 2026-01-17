package categories

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type Category struct {
	ID        string    `bson:"_id,omitempty"`
	Name      string    `bson:"name"`
	Slug      string    `bson:"slug"`
	CreatedAt time.Time `bson:"createdAt"`
}

type Repository interface {
	Create(ctx context.Context, name string, slug string) (*Category, error)
	List(ctx context.Context) ([]*Category, error)
	Delete(ctx context.Context, id string) error
	GetByName(ctx context.Context, name string) (*Category, error)
}

type repository struct {
	coll *mongo.Collection
}

func NewRepository(db *mongo.Database) Repository {
	return &repository{
		coll: db.Collection("categories"),
	}
}

func (r *repository) Create(ctx context.Context, name string, slug string) (*Category, error) {
	category := Category{
		Name:      name,
		Slug:      slug,
		CreatedAt: time.Now(),
	}

	res, err := r.coll.InsertOne(ctx, category)
	if err != nil {
		return nil, err
	}
	category.ID = res.InsertedID.(bson.ObjectID).Hex()
	return &category, nil
}

func (r *repository) List(ctx context.Context) ([]*Category, error) {
	opts := options.Find().SetSort(bson.D{{Key: "name", Value: 1}})
	cursor, err := r.coll.Find(ctx, bson.M{}, opts)
	if err != nil {
		return nil, err
	}
	var categories []*Category
	if err := cursor.All(ctx, &categories); err != nil {
		return nil, err
	}
	return categories, nil
}

func (r *repository) Delete(ctx context.Context, id string) error {
	idObj, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	_, err = r.coll.DeleteOne(ctx, bson.M{"_id": idObj})
	return err
}

func (r *repository) GetByName(ctx context.Context, name string) (*Category, error) {
	var category Category
	err := r.coll.FindOne(ctx, bson.M{"name": name}).Decode(&category)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	return &category, nil
}
