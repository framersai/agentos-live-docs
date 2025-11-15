<div align="center">
  <img src="../../logos/frame-logo-green-no-tagline.svg" alt="Frame Codex" width="150">

# Contributing to Frame Codex

**Help build humanity's knowledge repository**

</div>

---

## 🎯 Overview

Frame Codex is a community-driven project. We welcome contributions of all kinds:
- 📝 New knowledge content
- 🔧 Technical improvements
- 📚 Documentation enhancements
- 🌍 Translations
- 🐛 Bug fixes

## 🚀 Quick Start

1. **Fork the repository**
   ```bash
   git clone https://github.com/framersai/codex.git
   cd codex
   ```

2. **Create a branch**
   ```bash
   git checkout -b add-quantum-computing-strand
   ```

3. **Make your changes**
   - Follow the schemas
   - Validate your content
   - Test thoroughly

4. **Submit a pull request**
   - Clear description
   - Reference any issues
   - Pass all checks

## 📝 Content Contributions

### Adding a New Strand

1. **Choose the right weave and loom**
   ```
   weaves/
   └── technology/          # Choose appropriate weave
       └── looms/
           └── quantum/     # Find or create loom
               └── strands/
                   └── your-strand.md  # Add here
   ```

2. **Use the strand template**
   ```bash
   npm run create -- --type=strand \
     --weave=technology \
     --loom=quantum \
     --title="Quantum Entanglement Explained"
   ```

3. **Fill in the frontmatter**
   ```yaml
   ---
   id: "generate-uuid-here"
   slug: "quantum-entanglement"
   title: "Quantum Entanglement Explained"
   summary: "A comprehensive guide to quantum entanglement, covering the fundamental principles, experimental verification, and practical applications in quantum computing and cryptography."
   version: "1.0.0"
   contentType: "text/markdown"
   difficulty: "intermediate"
   
   taxonomy:
     subjects: ["Physics", "Quantum Mechanics"]
     topics: ["Quantum Entanglement", "Quantum Computing"]
     subtopics: ["Bell's Theorem", "EPR Paradox"]
   
   relationships:
     - type: "prerequisite"
       target: "quantum-mechanics-basics-uuid"
     - type: "related"
       target: "quantum-cryptography-uuid"
   
   publishing:
     author: "Your Name"
     created: "2024-11-15"
     license: "CC-BY-4.0"
   ---
   ```

4. **Write high-quality content**
   - Clear explanations
   - Accurate information
   - Proper citations
   - Examples when helpful

### Adding a New Loom

1. **Create loom directory**
   ```bash
   mkdir -p weaves/technology/looms/your-loom/strands
   ```

2. **Create loom.yaml**
   ```yaml
   slug: your-loom
   title: "Your Loom Title"
   summary: "Comprehensive description of what this loom covers..."
   tags: ["relevant", "tags"]
   ordering:
     type: sequential
     sequence: []  # Will be populated with strands
   ```

### Content Guidelines

#### ✅ DO:
- Write for both humans and AI
- Include examples and analogies
- Cite credible sources
- Use clear, accessible language
- Structure content logically
- Add helpful diagrams (with alt text)

#### ❌ DON'T:
- Copy content without attribution
- Include personal opinions as facts
- Use jargon without explanation
- Submit incomplete content
- Ignore schema requirements
- Add promotional content

### Quality Standards

All content must meet these standards:

1. **Accuracy**
   - Factually correct
   - Up-to-date information
   - Verified sources

2. **Clarity**
   - Well-structured
   - Easy to understand
   - Good examples

3. **Completeness**
   - Covers topic thoroughly
   - Includes prerequisites
   - Links to related content

4. **Formatting**
   - Follows markdown standards
   - Proper heading hierarchy
   - Code blocks with language tags

## 🔧 Technical Contributions

### Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run validation**
   ```bash
   npm run validate
   ```

3. **Build index**
   ```bash
   npm run build-index
   ```

### Code Standards

- **TypeScript** for scripts
- **ES Modules** for imports
- **Prettier** for formatting
- **ESLint** for linting

### Testing

```bash
# Run all tests
npm test

# Validate schemas
npm run test:schemas

# Check links
npm run test:links

# Validate content
npm run test:content
```

## 🌍 Translations

Help make Frame Codex accessible globally:

1. **Create language directory**
   ```
   weaves/technology/looms/ml/strands/
   ├── transformer.md         # Original (English)
   └── i18n/
       ├── es/
       │   └── transformer.md # Spanish
       └── zh/
           └── transformer.md # Chinese
   ```

2. **Translate frontmatter**
   ```yaml
   ---
   # Keep IDs and slugs unchanged
   id: "same-uuid-as-original"
   slug: "transformer-architecture"
   
   # Translate these fields
   title: "Comprendre l'Architecture Transformer"
   summary: "Un guide complet..."
   
   # Add language marker
   language: "fr"
   translatedFrom: "en"
   ---
   ```

## 📋 Pull Request Process

### Before Submitting

- [ ] Content follows all schemas
- [ ] Validation passes (`npm run validate`)
- [ ] Links are valid (`npm run check-links`)
- [ ] Commit messages are clear
- [ ] Branch is up-to-date with main

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New content (strand/loom/weave)
- [ ] Content update
- [ ] Bug fix
- [ ] Documentation
- [ ] Translation

## Checklist
- [ ] Schemas validated
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Related issues linked

## Screenshots (if applicable)
Add screenshots for UI changes
```

### Review Process

1. **Automated checks** run immediately
2. **Community review** within 48 hours
3. **Maintainer approval** for merge
4. **Auto-deployment** after merge

## 🏆 Recognition

### Contributor Levels

- 🌱 **Seedling** (1-5 contributions)
- 🌿 **Sprout** (6-20 contributions)
- 🌳 **Tree** (21-50 contributions)
- 🌲 **Forest** (50+ contributions)

### Hall of Fame

Top contributors are featured:
- Monthly spotlight on blog
- Special Discord role
- Early access to features
- Codex contributor badge

## 📚 Resources

### Documentation
- [Schema Reference](./schema.md)
- [API Documentation](./api.md)
- [Style Guide](./style-guide.md)

### Tools
- [UUID Generator](https://www.uuidgenerator.net/)
- [Markdown Linter](https://github.com/DavidAnson/markdownlint)
- [Schema Validator](https://www.jsonschemavalidator.net/)

### Community
- [Discord Server](https://discord.gg/framecodex)
- [GitHub Discussions](https://github.com/framersai/codex/discussions)
- [Twitter Updates](https://twitter.com/framersai)

## ⚖️ License

By contributing to Frame Codex, you agree that your contributions will be licensed under the Creative Commons Attribution 4.0 International License (CC-BY-4.0).

## 🤝 Code of Conduct

Frame Codex follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/). Please read and adhere to it.

### Our Standards

- **Respectful** communication
- **Inclusive** environment
- **Constructive** feedback
- **Collaborative** approach
- **Professional** conduct

## ❓ Getting Help

Need assistance?

1. **Check existing issues** on GitHub
2. **Ask in Discord** #help channel
3. **Read the FAQ** in wiki
4. **Email us** at codex@frame.dev

---

<div align="center">
  <br/>
  <p>
    <a href="https://frame.dev">Frame.dev</a> •
    <a href="https://frame.dev/codex">Frame Codex</a> •
    <a href="https://openstrand.ai">OpenStrand</a>
  </p>
  <p>
    <a href="https://github.com/framersai">GitHub</a> •
    <a href="https://twitter.com/framersai">Twitter</a>
  </p>
  <br/>
  <sub>Together, we're building the future of knowledge</sub>
</div>
