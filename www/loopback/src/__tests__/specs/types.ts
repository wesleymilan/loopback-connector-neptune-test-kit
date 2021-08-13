export type PeopleType = {
    id?: string,
    name: string,
    status: boolean,
    age: number,
    interests?: string[],
    collection?: object,
    createdAt: string
};

export type FollowFromToType = {
    id: string,
    label: string
};

export type FollowType = {
    id?: string,
    follower: string | FollowFromToType,
    followee: string | FollowFromToType,
    notification: boolean,
    createdAt: string
};

export type PostWithRelation = {
    id?: string,
    userId: string,
    content: string,
    createdAt: string
};

export type UserPosts = {
    [key: string]: PostWithRelation[]
};




