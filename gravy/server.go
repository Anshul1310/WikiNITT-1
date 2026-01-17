package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/joho/godotenv"
	"github.com/pranava-mohan/wikinitt/gravy/graph"
	"github.com/pranava-mohan/wikinitt/gravy/graph/model"
	"github.com/pranava-mohan/wikinitt/gravy/internal/articles"
	"github.com/pranava-mohan/wikinitt/gravy/internal/auth"
	"github.com/pranava-mohan/wikinitt/gravy/internal/categories"
	"github.com/pranava-mohan/wikinitt/gravy/internal/community"
	"github.com/pranava-mohan/wikinitt/gravy/internal/db"
	"github.com/pranava-mohan/wikinitt/gravy/internal/uploader"
	"github.com/pranava-mohan/wikinitt/gravy/internal/users"
	"github.com/rs/cors"
)

const defaultPort = "8080"

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		log.Fatal("MONGODB_URI environment variable is required")
	}

	dbClient, err := db.Connect(mongoURI)
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	database := dbClient.Database("wikinitt") 
	userRepo := users.NewRepository(database)
	articleRepo := articles.NewRepository(database)
	categoryRepo := categories.NewRepository(database)
	communityRepo := community.NewRepository(database)

	cldName := os.Getenv("CLOUDINARY_CLOUD_NAME")
	cldKey := os.Getenv("CLOUDINARY_API_KEY")
	cldSecret := os.Getenv("CLOUDINARY_API_SECRET")

	if cldName == "" || cldKey == "" || cldSecret == "" {
		log.Fatal("CLOUDINARY credentials are required")
	}

	uploaderService, err := uploader.NewUploader(cldName, cldKey, cldSecret)
	if err != nil {
		log.Fatalf("Failed to create Cloudinary uploader: %v", err)
	}

	c := graph.Config{
		Resolvers: &graph.Resolver{
			UserRepo:      userRepo,
			ArticleRepo:   articleRepo,
			CategoryRepo:  categoryRepo,
			CommunityRepo: communityRepo,
			Uploader:      uploaderService,
		},
	}
	c.Directives.Auth = func(ctx context.Context, obj interface{}, next graphql.Resolver, requires *model.Role) (interface{}, error) {
		user := auth.ForContext(ctx)
		if user == nil {
			return nil, fmt.Errorf("access denied: not authenticated")
		}

		if requires != nil && *requires == model.RoleAdmin && !user.IsAdmin {
			return nil, fmt.Errorf("access denied: admins only")
		}

		return next(ctx)
	}

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(c))

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", auth.Middleware(userRepo)(srv))

	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://127.0.0.1:3000"},
		AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodOptions},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, corsMiddleware.Handler(http.DefaultServeMux)))
}
