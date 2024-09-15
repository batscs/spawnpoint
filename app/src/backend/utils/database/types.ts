type project = {
    id: string,
    topics: string[],
    details: string[],
    name: string,
    description: string,
    banner: string,
    isPublished: boolean,
    startDate: string,
    endDate: string,
    source: string,
    preview: string,
}

type config = {
    password: string
}

type job = {
    name: string,
    title: string,
    timeline: string,
    description: string,
}

type about = {
    techstack: string[],
    interests: string[]
}
