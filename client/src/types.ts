export interface User {
    username: string;
    email: string;
    id: string;
    zone: string
}

export interface Courses {
    id: string;
    title: string;
    image_src: string | null;
}

export interface Course {
    id: string;
    title: string;
    image_src: string | null;
    units: Units[];
}

export interface Units {
    id: string;
    title: string;
    description: string;
    course_id: string;
    unit_order: number;
    lessons: Lessons[]
}

export interface Lessons {
    id: string;
    title: string;
    unit_id: string;
    lesson_order: number;
}
