# SoundButtonFuze

A full stack JavaScript solo project for people who want to listen and record sounds at a click of a button

## Why I Built This

As a fan of sound effects, I wanted to build an application that would let me listen to and record new sound effects.

## Live Demo
Try the application live at https://sound-button-fuze.eugenepark.dev/

## Technologies Used

  * React
  * PostgreSQL
  * Node.JS
  * AWS S3
  * JavaScript - ES6
  * HTML5
  * CSS3
  * Webpack
  * Dokku
  * npm - mic-recorder-to-mp3
     * https://www.npmjs.com/package/mic-recorder-to-mp3?activeTab=readme


## Features

  * Users can click on buttons and listen to correlating sound
  * Users can sign-in/sign-up
  * Users can record sounds
  * User can view sound oscillator while recording
  * User can listen to their recorded sound before submitting
  * User can name their recorded sounds
  * User can submit and view recorded sound on homepage
  * User can view bookmarked sounds


## Stretch Feature

  * User can bookmark sounds
  * User can play a medley of their bookmarked sounds
  * User can upload and set an image for their recorded sound


## Preview

![Preview](./server/public/images/kapture.gif)

## Development

### System Requirements

- AWS S3
- Node.js 10 or higher
- NPM 6 or higher
- PostgreSQL
- Microphone

### Getting Started

1. Clone the repository.

    ```shell
    git clone https://git@github.com:Eugenepark215/SoundButtonFuze.git
    ```

2. Install all dependencies with NPM.

    ```shell
    npm install
    ```

3. Create and name a bucket through Amazon S3 and set permissions as 'Objects can be public'. Note the region-id (should be similiar to us-east-1)


4. Create an Access Key ID and Secret Access Key for the bucket and store the information securely,


5. Make a copy of the provided .env.exmaple, name your copy .env,

    ```shell
    cp .env.example .env
    ```

6. Change the values of .env
    * TOKEN_SECRET=**changeMe**
    * DATABASE_URL=postgres://dev:dev@localhost/**changeMe**?sslmode=disable -
    * AWS_S3_REGION=**us-east-1**
    * AWS_S3_BUCKET=**some-bucket-name**
    * AWS_ACCESS_KEY_ID=**XXXXXXXXXXXXXXXXXXXX**
    * AWS_SECRET_ACCESS_KEY=**xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx**

7. Start PostgreSQL.

    ```shell
    sudo service postgresql start
    ```

8. Start the project. Once started you can view the application by opening http://localhost:3000 in your browser.

    ```shell
    npm run dev
    ```
