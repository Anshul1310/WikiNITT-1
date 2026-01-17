package auth

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/pranava-mohan/wikinitt/gravy/internal/users"
)

var userCtxKey = &contextKey{"user"}

type contextKey struct {
	name string
}

func Middleware(userRepo users.Repository) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			header := r.Header.Get("Authorization")

			if header == "" {
				next.ServeHTTP(w, r)
				return
			}

			tokenStr := header
			splitToken := strings.Split(header, "Bearer ")
			if len(splitToken) == 2 {
				tokenStr = splitToken[1]
			}

			userID, err := ParseToken(tokenStr)
			if err != nil {
				http.Error(w, "Invalid token", http.StatusForbidden)
				return
			}

			user, err := userRepo.GetByID(r.Context(), userID)
			if err != nil {
				fmt.Printf("Middleware: Failed to get user by ID: %s, error: %v\n", userID, err)
				next.ServeHTTP(w, r)
				return
			}
			fmt.Printf("Middleware: Authenticated user: %s\n", user.ID)

			ctx := context.WithValue(r.Context(), userCtxKey, user)

			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}

func ForContext(ctx context.Context) *users.User {
	raw, _ := ctx.Value(userCtxKey).(*users.User)
	return raw
}
