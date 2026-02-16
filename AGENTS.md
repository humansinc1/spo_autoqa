# Instructions for AI agents

- use Page Object Model
- use Playwrite MCP as tool for browser interaction
- use Playwrite best practices to write code of tests
    - use Web-First Assertions
    - don't use locators based on text of element
- follow KISS and DRY principles for generating and writing tests
- split task to logical steps
- execute task step by step asking review and confirmation from user after each step
- ask user for information that is unclear

## Plan Mode

- Make the plan extremely concise. Sacrifice grammar for the sake of concision.
- At the end of each plan, give me a list of unresolved questions to answer, if any.

## Architecture

- pages/ contains page objects
- test/ contains tests
- fixtures/ contains fixtures
- test-data/ contains test data