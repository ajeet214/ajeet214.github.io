## Portfolio Website

This repository hosts my personal portfolio [website](https://ajeet214.github.io/).

It showcases my work as an AI/ML Engineer & Data Scientist, my projects, blog posts, and ways to connect.

The project began as a clean **Jekyll-based** portfolio and has evolved with several key features step by step.

---

## ✨ Features

- 🏠 Home Page (Hero Section) – Short bio, CTA links, and introduction.

- 💼 Projects Showcase – Filterable and searchable grid of projects with tags and tech stacks.

- 🧠 Skills Grid – AI/ML tools, programming languages, and frameworks in a clean grid layout.

- 👨‍💻 About Page – Professional journey and expertise.

- ✍️ Blog – Space to publish articles, research summaries, and learning notes.

- 📬 Contact Page – Working contact form powered by Formspree.

- 🌗 Dark / Light Theme – Toggle switch with ripple animation and persistence via `localStorage`.

- 🌍 Multi-Language Support – English (`/`), Vietnamese (`/vn`), Korean (`/kr`) via dropdown menu.

- ♿ Accessibility Friendly – ARIA attributes, keyboard navigation, focus management.

- 📱 Responsive Design – Optimized for desktop, tablet, and mobile displays.

---

## 🛠️ Tech Stack

| Component          | Technology                         |
| ------------------ | ---------------------------------- |
| **Site Generator** | [Jekyll](https://jekyllrb.com/)    |
| **Frontend**       | HTML5, SCSS, JavaScript (Vanilla)  |
| **Hosting**        | GitHub Pages                       |
| **Contact Form**   | [Formspree](https://formspree.io/) |


---

## 📂 Project Structure

```commandline
Directory structure:
└── ajeet214.github.io/
    ├── _config.yml                                   # Jekyll site config
    ├── index.html
    ├── thank-you.html
    ├── _includes/                                    # Shared components
    │   ├── footer.html                               # Footer
    │   ├── head.html     
    │   ├── lang-switch.html                          # Language dropdown
    │   └── nav.html
    ├── _layouts/
    │   └── default.html                              # Base layout
    ├── _medium/
    │   ├── automating-microsoft-outlook.md
    │   ├── benchmark_your_python_code_like_a_pro_with_timeit_module.md
    │   ├── powerautomate_vs_copilot_studio.md
    │   ├── robot_framework.md
    │   ├── semantic_search_using_faiss_openai_streamlit.md
    │   ├── stackoverflow_notifier_using_gitHub_actions_and_pushover.md
    │   └── unlocking-langchains-agent-toolkits.md
    ├── about/
    │   └── index.html
    ├── assets/
    │   ├── css/
    │   │   ├── _about.scss
    │   │   ├── _base.scss
    │   │   ├── _blog.scss
    │   │   ├── _cards.scss
    │   │   ├── _components.scss
    │   │   ├── _footer.scss
    │   │   ├── _forms.scss
    │   │   ├── _hero.scss
    │   │   ├── _lang-switch.scss
    │   │   ├── _lang.scss
    │   │   ├── _nav.scss
    │   │   ├── _projects.scss
    │   │   ├── _tags.scss
    │   │   ├── _theme-toggle.scss
    │   │   ├── _variables.scss
    │   │   └── main.scss
    │   └── js/
    │       └── main.js                               # Navigation, theme, lang switch, form handling
    ├── blog/
    │   └── index.html
    ├── contact/
    │   └── index.html
    ├── en/
    │   ├── index.html
    │   ├── about/
    │   │   └── index.html
    │   ├── blog/
    │   │   └── index.html
    │   ├── contact/
    │   │   └── index.html
    │   └── projects/
    │       └── index.html
    ├── kr/
    │   ├── index.html
    │   ├── about/
    │   │   └── index.html
    │   ├── blog/
    │   │   └── index.html
    │   ├── contact/
    │   │   └── index.html
    │   └── projects/
    │       └── index.html
    ├── projects/
    │   └── index.html
    └── vn/
        ├── index.html
        ├── about/
        │   └── index.html
        ├── blog/
        │   └── index.html
        ├── contact/
        │   └── index.html
        └── projects/
            └── index.html

```

## 🚀 Setup & Run Locally
1. **Install dependencies**

   Ensure you have [Ruby](https://www.ruby-lang.org/en/) & [Jekyll](https://jekyllrb.com/docs/installation/) installed.
2. **Clone the repo**:
   ```
   git clone https://github.com/ajeet214/ajeet214.github.io.git
   cd ajeet214.github.io
   ```
3. **Install**:
   ```commandline
   bundle install
   ```
4. **Run locally**:
   ```commandline
   bundle exec jekyll serve
   ```
5. **Open in browser**:
   ```commandline
   http://localhost:4000
   ```
   
---

## 🧩 Customize for Your Own Portfolio

This portfolio was designed to be simple to adapt for other developers, data scientists, or AI engineers.

Here’s how you can make it your own:

1. **Fork this repository**

  - Click “Fork” on GitHub to create your own copy.

  - Rename the repo to yourusername.github.io.

  - GitHub Pages will automatically deploy it at https://yourusername.github.io.

2. **Edit site details in** `_config.yml`

   Update your name, site URL, and other metadata:
   ```
   title: "Your Name"
   url: "https://yourusername.github.io"
   ```

3. **Update content**

   - Replace text in `index.html`, `/about/`, `/projects/`, `/contact/`.

   - Add or remove projects by editing the `projects` HTML.

   - Modify `assets/images/` for your own images and icons.

4. **Customize colors and theme**

   - Edit variables in assets/css/_variables.scss (if defined).

   - Adjust spacing, typography, or theme transitions easily.

5. **Translate content (optional)**

   - Add your own languages under `/lang-code/` (e.g., `/fr/`, `/es/`).
   - The JS language switcher automatically handles redirects and persistence.

6. **Change contact form**

   - Replace Formspree endpoint with your own.
   - Or integrate another form service (Netlify, EmailJS, etc.).

You’ll have your personalized portfolio deployed in minutes!

---

## 🌍 Multi-Language Design

| Language   | URL Path     | Example                                |
| ---------- | ------------ | -------------------------------------- |
| English    | `/` or `/en` | `https://ajeet214.github.io/about/`    |
| Vietnamese | `/vn`        | `https://ajeet214.github.io/vn/about/` |
| Korean     | `/kr`        | `https://ajeet214.github.io/kr/about/` |

The dropdown selector (🌐) in the navbar updates your preferred language and saves it locally for future visits.

---

## 📈 Development Journey

1. **Initial Setup** – Jekyll structure with Home, About, Projects, Blog, Contact pages.

2. **Hero Section & Projects Grid** – Highlighted key projects with responsive cards.

3. **Skills Grid** – Added a dedicated grid to show AI/ML tools & technologies.

4. **Dark/Light Theme** – Implemented a toggle with persistence and micro-interactions.

5. **Language Support** – First attempted page-specific switching, later redesigned into a global language system (/, /en, /vn, /kr).

6. **Navbar Integration** – Added dropdown 🌐 to select language (with flag + code).

7. **Accessibility & Polish** – Improved animations, ARIA labels, responsive design.

---

## 🧑‍💻 Contributing

Contributions, suggestions, and improvements are welcome!

If you’d like to contribute:

1. Fork the repo

2. Create a new branch
   ```
   git checkout -b feature/your-feature
   ```
3. Commit and push changes
   ```
   git commit -m "Add new feature"
   git push origin feature/your-feature
   ```
4. Submit a Pull Request for review

---

## 📄 License

This project is open-source and available under the MIT License.
You’re free to use, modify, and distribute it — just keep attribution in place.
```
MIT License © 2025 Ajeet Verma
```