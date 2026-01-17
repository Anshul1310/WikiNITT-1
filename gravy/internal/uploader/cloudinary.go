package uploader

import (
	"context"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

type Uploader interface {
	UploadImage(ctx context.Context, file interface{}, folder string) (string, error)
}

type cloudinaryUploader struct {
	cld *cloudinary.Cloudinary
}

func NewUploader(cloudName, apiKey, apiSecret string) (Uploader, error) {
	cld, err := cloudinary.NewFromParams(cloudName, apiKey, apiSecret)
	if err != nil {
		return nil, err
	}
	return &cloudinaryUploader{cld: cld}, nil
}

func (u *cloudinaryUploader) UploadImage(ctx context.Context, file interface{}, folder string) (string, error) {
	resp, err := u.cld.Upload.Upload(ctx, file, uploader.UploadParams{
		Folder: folder,
	})
	if err != nil {
		return "", err
	}
	return resp.SecureURL, nil
}
