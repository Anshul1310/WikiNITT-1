package articles

import (
	"fmt"
	"regexp"
	"strings"

	"github.com/teris-io/shortid"
)

func GenerateSlug(title string, limit int) (string, error) {

	slug := strings.ToLower(title)

	reg, err := regexp.Compile(`[^a-z0-9\s]+`)
	if err != nil {
		return "", err
	}
	slug = reg.ReplaceAllString(slug, "")

	slug = strings.ReplaceAll(slug, " ", "-")

	regMultiDash, _ := regexp.Compile("-+")
	slug = regMultiDash.ReplaceAllString(slug, "-")

	slug = strings.Trim(slug, "-")

	if len(slug) > limit {
		slug = slug[:limit]
		slug = strings.TrimRight(slug, "-")
	}

	suffix, err := shortid.Generate()
	if err != nil {
		return "", err
	}

	return fmt.Sprintf("%s-%s", slug, suffix), nil
}
