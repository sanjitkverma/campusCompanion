module.exports = function (plop) {
    plop.setGenerator('component', {
        description: 'Create a React component',
        prompts: [{
            type: 'input',
            name: 'name',
            message: 'Component name:',
        }],
        actions: [{
            type: 'add',
            path: 'frontend/src/components/{{pascalCase name}}/{{pascalCase name}}.js',
            templateFile: 'plop-templates/component.hbs',
        }, {
            type: 'add',
            path: 'frontend/src/components/{{pascalCase name}}/{{pascalCase name}}.module.css',
            templateFile: 'plop-templates/component.css.hbs',
        }],
    });

    plop.setGenerator('page', {
        description: 'Create a page',
        prompts: [{
            type: 'input',
            name: 'name',
            message: 'Page name:',
        }],
        actions: [{
            type: 'add',
            path: 'frontend/src/pages/{{pascalCase name}}/{{pascalCase name}}.js',
            templateFile: 'plop-templates/page.hbs',
        }],
    });
};
