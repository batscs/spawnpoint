// src/routes/router.ts
import { Router, Request, Response } from 'express';
const router = Router();
import date from "../utils/common/date";
import db from "../utils/database/proxy";
import usageLogger from "../middleware/usage-logger";
import log from "../utils/common/logger";
import hljs from 'highlight.js'; // Import highlight.js
import { marked, Slugger, Renderer } from 'marked';
const renderer = new marked.Renderer();

// this here exists so [video](https://video-url.com/file.mp4) links get rendered into a <video> </video> element
renderer.link = (href: any, title: string, text: string) => {
    // Extract the relevant fields from href if it's an object
    const hrefUrl = typeof href === 'object' && href.href ? href.href : href;
    const hrefText = typeof href === 'object' && href.text ? href.text : text;
    const hrefTitle = typeof href === 'object' && href.title ? href.title : title;

    // Check if the text is 'video' to apply the video tag logic
    if (hrefText && hrefText.toLowerCase() === 'video' && hrefUrl) {
        return `<video controls autoplay muted loop>
                    <source src="${hrefUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>`;
    }

    // Fallback for normal links if the text is not 'video'
    const linkTitle = hrefTitle ? ` title="${hrefTitle}"` : '';
    return `<a href="${hrefUrl}"${linkTitle}>${hrefText}</a>`;
};

marked.setOptions({
    renderer,
    highlight: (code, lang) => {
        // Check if the language is valid for highlight.js
        const validLang = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language: validLang }).value;
    },
    langPrefix: 'hljs language-', // Add a class to the <code> block
});

router.get('/', usageLogger("HOME"), (req: Request, res: Response) => {
    res.render("home/index");
});

router.get('/contact', usageLogger("CONTACT"), (req: Request, res: Response) => {
    const about = db.getAbout();
    res.render("home/contact", {email: about.email});
});

router.get('/about', usageLogger("ABOUT"), (req: Request, res: Response) => {
    let jobs: job[] = db.getJobs();
    const about = db.getAbout();

    jobs.forEach(job => {
        job.description = marked.parse(job.description);
    });

    res.render("home/about", {jobs: jobs, interests: about.interests.sort(), techstack: about.techstack.sort()});
});

function generateTOC(markdown: string): { title: string, url: string }[] {
    const toc: { title: string, url: string }[] = [];
    const slugger = new marked.Slugger();

    // Custom renderer to collect headings with types
    const renderer = new marked.Renderer();
    renderer.heading = function (text: string, level: number, raw: string): string {
        const slug = slugger.slug(raw); // Use slugger instance to generate slugs
        if (level <= 1) {
            toc.push({ title: text, url: `#${slug}` });
        }
        return ''; // Don't render the heading, just collect it
    };

    // Parse the markdown to collect the headings
    marked(markdown, { renderer });

    return toc;
}


router.get('/project/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const project = db.getProjectById(id);
    log.addUsageLog(req, `PROJECT - ID: ${id}`);

    // TODO Abfangen ob project == null
    if (project) {
        const desc: string = project.description;
        const markdown = marked.parse(desc);
        const table_of_content = generateTOC(desc);
        res.render("home/project", {project: project, markdown: markdown, table_of_contents: table_of_content});
    } else {
        res.render("home/error");
    }

});

router.get("/home/work", usageLogger("BAITED /HOME/WORK"), (req: Request, res: Response) => {
    res.redirect("/projects");
})

router.get('/projects', usageLogger("PROJECTS"), (req: Request, res: Response) => {

    let projects = db.getProjects();

    projects = projects.filter(project => project.isPublished);
    projects = projects.sort((left, right) : number => {
        return -1 * date.compareDates(left.startDate, right.startDate);
    });

    let topics = new Set<string>();

    projects.forEach(project => {
        project.topics.forEach(topic => {
            topics.add(topic);
        })
    });


    res.render('home/work', {projects: projects, topics: Array.from(topics).sort()});
});

export default router;
