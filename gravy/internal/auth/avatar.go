package auth

import (
	"context"
	"fmt"
	"image/png"
	"os"

	"github.com/MuhammadSaim/goavatar"
	"github.com/pranava-mohan/wikinitt/gravy/internal/uploader"
)

func AvatarGenerationAndCleanup(userid string, uploader uploader.Uploader) (string, error) {
	img := goavatar.Make(userid, goavatar.WithSize(512))

	file, err := os.CreateTemp("", fmt.Sprintf("avatar_%s_*.png", userid))
	if err != nil {
		return "", err
	}
	filename := file.Name()
	defer os.Remove(filename)

	if err := png.Encode(file, img); err != nil {
		file.Close()
		return "", err
	}
	file.Close()

	avatarFile, err := os.Open(filename)
	if err != nil {
		return "", err
	}
	defer avatarFile.Close()

	avatarURL, err := uploader.UploadImage(context.Background(), avatarFile, "avatars")
	if err != nil {
		return "", err
	}

	return avatarURL, nil
}
