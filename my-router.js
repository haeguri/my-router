class RouterData {
    constructor(data){
        ['name', 'view', 'path'].forEach(k => {
            if(!(k in data) || typeof data[k] !== 'string' || !data[k]) {
                throw new Error(`${k} is invalid.`);
            }
        });
        if(!('ctrl' in data) || typeof data.ctrl !== 'function') {
            throw new Error('ctrl is invalid');
        }
        this.name = data.name;
        this.view = data.view;
        this.ctrl = data.ctrl;
    }
}

class Template {
    // constructor()
}

class Router {
    constructor(configList){
        configList.forEach(config=>{
            const rData = new RouterData(config);
        });

        window.onhashchange = window.onhashchange || ((event) => {
            console.log(event.newURL);
            const newHash = event.newURL.slice(event.newURL.indexOf('#')+1);
            console.log(newHash);
        });
    }
}

const homeCtrl = () => {

};

const todosCtrl = () => {

};

const router = new Router([
    {
        name: 'home',
        path: 'home',
        view: 'views/home.html',
        ctrl: homeCtrl
    },
    {
        name: 'todos',
        path: 'todos',
        view: 'views/todos.html',
        ctrl: todosCtrl
    }
]);