#!/bin/bash

# Script to update all local image paths to R2 URLs
# This helps identify which components need real images by removing placeholders

R2_URL="${NEXT_PUBLIC_R2_PUBLIC_URL:-https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev}"
IMAGE_PREFIX="nambi-uganda-safaris/images"

echo "🔄 Updating image paths to R2..."
echo "Using R2 URL: $R2_URL"
echo ""

# Function to replace image path
replace_image() {
    local old_path=$1
    local new_filename=$2
    local file_pattern=$3

    echo "  Replacing: $old_path -> $new_filename"

    # Using sed with proper escaping
    find . -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) \
        ! -path "./node_modules/*" \
        ! -path "./.next/*" \
        ! -path "./coverage/*" \
        ! -path "./.git/*" \
        -exec sed -i.bak "s|\"$old_path\"|\"$R2_URL/$IMAGE_PREFIX/$new_filename\"|g" {} \;
}

# Update common images
replace_image "/uganda-safari-landscape-team-adventure.jpg" "uganda-safari-landscape-team-adventure.webp"
replace_image "/uganda-gorilla-trekking-adventure.jpg" "uganda-gorilla-trekking-adventure.webp"
replace_image "/uganda-queen-elizabeth-national-park-safari.jpg" "uganda-queen-elizabeth-national-park-safari.webp"
replace_image "/african-male-tour-guide-professional.jpg" "african-male-tour-guide-professional.webp"
replace_image "/african-female-tour-manager-professional.jpg" "african-female-tour-manager-professional.webp"
replace_image "/african-male-safari-guide-professional.jpg" "african-male-safari-guide-professional.webp"

# Remove placeholder references (set to empty string to show what's missing)
echo ""
echo "🗑️  Removing placeholder images..."
find . -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) \
    ! -path "./node_modules/*" \
    ! -path "./.next/*" \
    ! -path "./coverage/*" \
    ! -path "./.git/*" \
    ! -path "./__tests__/*" \
    ! -path "./components/__tests__/*" \
    -exec sed -i.bak 's||| "/placeholder\.svg"||g' {} \;

# Clean up backup files
echo ""
echo "🧹 Cleaning up backup files..."
find . -type f -name "*.bak" ! -path "./node_modules/*" -delete

echo ""
echo "✅ Image path update complete!"
echo ""
echo "Note: Placeholders have been removed. Components without images will show broken image icons,"
echo "making it easy to identify which ones need real images assigned."
