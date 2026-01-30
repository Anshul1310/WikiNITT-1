package main

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"os"
	"strings"

	"github.com/joho/godotenv"
	"github.com/pranava-mohan/wikinitt/gravy/internal/db"
	"go.mongodb.org/mongo-driver/v2/bson"
)

// List of nice placeholder images (Nature, Tech, Campus vibes)
var validImages = []string{
	"https://res.cloudinary.com/dbxtgjwyv/image/upload/v1768746331/16284893_n3s1ub.jpg",
	"https://res.cloudinary.com/dbxtgjwyv/image/upload/v1768746331/16284907_xifwe2.jpg",
	"https://res.cloudinary.com/dbxtgjwyv/image/upload/v1768746331/16284893_n3s1ub.jpg", // Campus
	"https://res.cloudinary.com/dbxtgjwyv/image/upload/v1768746331/16284893_n3s1ub.jpg",
	"https://res.cloudinary.com/dbxtgjwyv/image/upload/v1768746331/16284907_xifwe2.jpg",
	"https://res.cloudinary.com/dbxtgjwyv/image/upload/v1768746331/16284893_n3s1ub.jpg", // Tech/Meeting
	"https://res.cloudinary.com/dbxtgjwyv/image/upload/v1768746331/16284907_xifwe2.jpg", // Campus outdoor
}

func main() {
	// 1. Load Env & Connect
	_ = godotenv.Load("../../.env")

	// Default to localhost for local fixing
	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017/wikinitt"
	}
	// Force localhost if the URI is pointing to docker container
	mongoURI = strings.Replace(mongoURI, "mongodb://mongodb", "mongodb://localhost", 1)

	fmt.Println("🔌 Connecting to:", mongoURI)
	client, err := db.Connect(mongoURI)
	if err != nil {
		log.Fatalf("Failed to connect: %v", err)
	}
	defer client.Disconnect(context.Background())

	database := client.Database("wikinitt")
	collection := database.Collection("articles")
	ctx := context.Background()

	// 2. Fetch all articles
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		log.Fatalf("Failed to fetch articles: %v", err)
	}
	defer cursor.Close(ctx)

	fmt.Println("🔄 Updating article images...")
	count := 0

	// 3. Loop through and update each one
	for cursor.Next(ctx) {
		var doc struct {
			ID bson.ObjectID `bson:"_id"`
		}
		if err := cursor.Decode(&doc); err != nil {
			log.Printf("Skipping doc: %v", err)
			continue
		}

		// Pick a random image
		newImage := validImages[rand.Intn(len(validImages))]

		_, err := collection.UpdateOne(
			ctx,
			bson.M{"_id": doc.ID},
			bson.M{"$set": bson.M{"thumbnail": newImage}},
		)
		if err != nil {
			log.Printf("Failed to update %s: %v", doc.ID, err)
		} else {
			count++
		}
	}

	fmt.Printf("✅ Successfully updated %d articles with new images!\n", count)
}
