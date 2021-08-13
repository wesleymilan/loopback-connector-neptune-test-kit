
const PeopleRequestProperties = {
    "name": {
        "type": "string"
    },
    "age": {
        "type": "number"
    },
    "interests": {
        "type": "array",
        "items": {
            "type": "string"
        }
    },
    "collection": {
        "type": "object"
    },
    "status": {
        "type": "boolean"
    },
    "createdAt": {
        "type": "string",
        "format": "date-time"
    }
};

const PeopleRequestSchema = {
    "$ref": "#/components/schemas/NewPeople",
    "definitions": {
        "NewPeople": {
            "title": "NewPeople",
            "type": "object",
            "description": "New people creation",
            "properties": PeopleRequestProperties,
            "additionalProperties": false,
        }
    }
};

export const PeopleRequestBody = {
    content: {
        'application/json': {
            schema: PeopleRequestSchema,
        },
    },
};

const PeopleManyRequestSchema = {
    "$ref": "#/components/schemas/BatchPeople",
    "definitions": {
        "BatchPeople": {
            "title": "BatchPeople",
            "description": "Batch people creation",
            "type": "array",
            "items": {
                "type": "object",
                "properties": PeopleRequestProperties
            }
        }
    }
};

export const PeopleManyRequestBody = {
    content: {
        'application/json': {
            schema: PeopleManyRequestSchema,
        },
    },
};

