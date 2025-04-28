# Run it
docker run -it --rm -v./:/app -p 4000:4000 -e GIT_AUTHOR_NAME="Mayank Rathee" \
  -e GIT_AUTHOR_EMAIL="mayankrathee.japan@gmail.com" \
  -e GIT_COMMITTER_NAME="Mayank Rathee" \
  -e GIT_COMMITTER_EMAIL="mayankrathee.japan@gmail.com" \
   alfolio-site
