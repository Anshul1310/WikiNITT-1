package main

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"github.com/pranava-mohan/wikinitt/gravy/internal/db"
	"go.mongodb.org/mongo-driver/v2/bson"
)

// Article matches the struct in internal/articles/repository.go
type Article struct {
	ID        bson.ObjectID `bson:"_id,omitempty"`
	Title     string        `bson:"title"`
	Content   string        `bson:"content"`
	Slug      string        `bson:"slug"`
	Category  string        `bson:"category"`
	Thumbnail string        `bson:"thumbnail"`
	Featured  bool          `bson:"featured"`
	AuthorID  string        `bson:"authorId"`
	CreatedAt time.Time     `bson:"createdAt"`
	UpdatedAt time.Time     `bson:"updatedAt"`
	Indexed   bool          `bson:"indexed"`
}

var (
	categories = []string{"Campus Life", "Academics", "Hostels", "Events", "Clubs", "Departments"}
	titles     = []string{
		"History of Festember", "Guide to Garnet Hostel", "Life at Octagon",
		"Department of CSE", "Nittfest Highlights", "Pragyan Events",
		"Sportsfete 2024", "First Year Guide", "Mess Food Reviews",
		"Library Rules", "Hospital Timings", "Bus Schedule",
	}
	thumbnails = []string{
		"https://images.unsplash.com/photo-1541339907198-e08756dedf3f",
		"https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
		"https://images.unsplash.com/photo-1562774053-701939374585",
		"https://images.unsplash.com/photo-1592280771800-bcf291d02e0c",
	}
)

func generateSlug(title string) string {
	slug := strings.ToLower(title)
	slug = strings.ReplaceAll(slug, " ", "-")
	// Add random suffix to ensure uniqueness
	return fmt.Sprintf("%s-%d", slug, rand.Intn(100000))
}

func main() {
	// 1. Load Environment
	if err := godotenv.Load("../../.env"); err != nil {
		// Try loading from current dir if running from cmd folder
		if err := godotenv.Load(); err != nil {
			log.Println("Warning: No .env file found")
		}
	}

	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		log.Fatal("MONGODB_URI is required")
	}

	// 2. Connect to DB
	client, err := db.Connect(mongoURI)
	if err != nil {
		log.Fatalf("Failed to connect: %v", err)
	}
	defer client.Disconnect(context.Background())

	db := client.Database("wikinitt")
	
	// 3. Find an Author (We need a valid User ID)
	var author struct {
		ID string `bson:"_id"`
	}
	// Try to find the admin user first, or just any user
	err = db.Collection("users").FindOne(context.Background(), bson.M{}).Decode(&author)
	if err != nil {
		log.Fatal("❌ No users found! Please create an admin user first using 'make admin' or the create_admin tool.")
	}
	fmt.Printf("👤 Assigning articles to Author ID: %s\n", author.ID)

	// 4. Generate Data
	var articles []interface{}
	
	// Create 50 dummy articles
	for i := 0; i < 50; i++ {
		title := fmt.Sprintf("%s %d", titles[rand.Intn(len(titles))], i)
		cat := categories[rand.Intn(len(categories))]
		
		articles = append(articles, Article{
			Title:     title,
			Content:   fmt.Sprintf("# %s\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. \n\n## History\nThis is a dummy article about %s. It contains **markdown** content.", title, title),
			Slug:      generateSlug(title),
			Category:  cat,
			Thumbnail: thumbnails[rand.Intn(len(thumbnails))],
			Featured:  rand.Intn(2) == 1, // 50% chance
			AuthorID:  author.ID,
			CreatedAt: time.Now().Add(-time.Duration(rand.Intn(1000)) * time.Hour),
			UpdatedAt: time.Now(),
			Indexed:   true,
		})
	}

	// 5. Insert Batch
	_, err = db.Collection("articles").InsertMany(context.Background(), articles)
	if err != nil {
		log.Fatalf("Failed to insert: %v", err)
	}

	fmt.Println("✅ Successfully seeded 50 articles into the database!")
}