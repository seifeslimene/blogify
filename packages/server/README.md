# `@blogify/server`

Background Services. The Configuration File Is In `../../.env`.

## swagger documentation

After Starting The Project, Visit `http://localhost:3003/api` To Preview The Swagger Document.

## Module

### User

- `POST /user/register`: User Registration (`name`, `password`)
- `POST /auth/login`: User Login (`name`, `password`)
- `POST /user/update`: Update User Information
- `POST /user/password`: Update User Password (`oldPassword`, `newPassword`)

### article

- `POST /article`: Create Article
- `GET /article`: Get All Articles
- `GET /article/category/:categoryId`: Get All Articles Under The Specified Category
- `GET /article/tag/:tagId`: Get All Articles Under The Specified Tag
- `GET /article/archives`: Get All Article Archives
- `GET /article/:articleId`: Get The Specified Article
- `GET /article/all/recommend`: Get All Recommended Articles
- `GET /article/recommend/:articleId`: Get Recommended Articles For The Specified Article
- `POST /article/:articleId/checkPassword`: Verify The Password Of The Specified Article
- `POST /article/:articleId/views`: Specified Article Views +1
- `POST /article/:articleId/`: Update The Specified Article
- `DELETE /article/:articleId/`: Delete The Specified Article

### Article classification

- `POST /category`: Create Article Category
- `GET /category`: Get All Article Categories
- `GET /category/:id`: Get The Specified Article Category
- `POST /category/:id`: Update The Specified Article Category
- `DELETE /category/:id`: Delete The Specified Article Category

### Article Tags

- `POST /tag`: Create Article Tags
- `GET /tag`: Get All Article Tags
- `GET /tag/:id`: Get The Specified Article Tag
- `POST /tag/:id`: Update The Specified Article Tag
- `DELETE /tag/:id`: Delete The Specified Article Tag

### Article comments

- `POST /commengt`: Create A Comment
- `GET /commengt`: Get All Comments
- `GET /commengt/host/:hostId`: Get Comments On The Specified Article (Or Page)
- `POST /commengt/:id`: Update The Specified Comment
- `DELETE /commengt/:id`: Delete The Specified Comment

### Page

- `POST /page`: Create Page
- `GET /page`: Get All Pages
- `GET /page/:id`: Get The Specified Page
- `POST /page/:id`: Update The Specified Page
- `POST /page/:id/views`: Specified Page Views +1
- `DELETE /page/:id`: Delete The Specified Page

### document

- `POST /file/`: Upload File
- `GET /file/:id`: Get The Specified File Record
- `DELETE /file/:id`: Delete The Specified File Record

### search

- `POST /search/article`: Search For Articles
- `GET /search`: Get All Search Records
- `DELETE /search/:id`: Delete The Specified Search Record

### set up

- `POST /setting`: Update Settings
- `POST /setting/get`: Get Settings

### mail

- `POST /smtp`: Send Email
- `GET /smtp`: Get Email Records
- `DELETE /smtp/:id`: Delete The Specified Email Record
