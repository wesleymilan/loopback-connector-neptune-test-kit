
const PostsRequestProperties = {
    "userId": {
        "type": "string"
    },
    "content": {
        "type": "string"
    },
    "createdAt": {
        "type": "string",
        "format": "date-time"
    }
};

const PostsRequestSchema = {
    "$ref": "#/components/schemas/NewPosts",
    "definitions": {
        "NewPosts": {
            "title": "NewPosts",
            "type": "object",
            "description": "New post creation",
            "properties": PostsRequestProperties,
            "additionalProperties": false,
        }
    }
};

export const PostsRequestBody = {
    content: {
        'application/json': {
            schema: PostsRequestSchema,
        },
    },
};

export type PostRequestType = {
    userId: string,
    content: string,
    createdAt: string
};
