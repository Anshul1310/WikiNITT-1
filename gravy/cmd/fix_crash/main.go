package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
	"github.com/pranava-mohan/wikinitt/gravy/internal/db"
	"go.mongodb.org/mongo-driver/v2/bson"
)

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
	ctx := context.Background()

	// 2. Find the Admin User
	fmt.Println("🔍 Looking for 'admin' user...")
	var adminUser struct {
		ID string `bson:"_id"`
	}
	err = database.Collection("users").FindOne(ctx, bson.M{"username": "admin"}).Decode(&adminUser)
	if err != nil {
		log.Fatal("❌ Could not find user 'admin'. Please run the create_admin tool first.")
	}
	fmt.Printf("✅ Found Admin ID: %s\n", adminUser.ID)

	// 3. Fix the Articles
	fmt.Println("🛠️  Updating all articles to use this Author ID...")
	result, err := database.Collection("articles").UpdateMany(
		ctx,
		bson.M{}, // Select ALL articles
		bson.M{"$set": bson.M{"authorId": adminUser.ID}},
	)
	if err != nil {
		log.Fatalf("❌ Failed to update: %v", err)
	}

	fmt.Printf("🎉 Success! Fixed %d articles.\n", result.ModifiedCount)
	fmt.Println("🚀 You can now restart your backend server.")
}
