# Use an ARM64-compatible Ruby base image
FROM ruby:2.7.8-slim-bullseye

# Install dependencies
RUN apt-get update -qq && apt-get install -y \
    build-essential \
    libpq-dev \
    nodejs \
    git \
    bash \
    openssh-client \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Gemfile and Gemfile.lock if you have them
COPY Gemfile Gemfile.lock ./

# Install Bundler and project gems
RUN gem install bundler && bundle install

# Copy the rest of the project files
# COPY . .

# Expose the port Jekyll serves on
EXPOSE 4000

# Default command
CMD ["/bin/bash"]
# CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0"]
