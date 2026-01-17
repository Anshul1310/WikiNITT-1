package graph

import (
	"math/rand"
	"regexp"
	"strings"
	"time"
)

func generateSlug(name string) string {
	
	slug := strings.ToLower(name)
	
	reg := regexp.MustCompile("[^a-z0-9]+")
	slug = reg.ReplaceAllString(slug, "-")
	
	slug = strings.Trim(slug, "-")
	return slug
}

const letterBytes = "abcdefghijklmnopqrstuvwxyz0123456789"

func randString(n int) string {
	rand.Seed(time.Now().UnixNano())
	b := make([]byte, n)
	for i := range b {
		b[i] = letterBytes[rand.Intn(len(letterBytes))]
	}
	return string(b)
}
