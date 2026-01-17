package sanitization

import (
	"github.com/microcosm-cc/bluemonday"
)

func SanitizeContent(input string) string {
	p := bluemonday.UGCPolicy()
	return p.Sanitize(input)
}

func SanitizeString(input string) string {
	p := bluemonday.StrictPolicy()
	return p.Sanitize(input)
}
