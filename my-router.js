const sel = s => document.querySelector(s);

class RouteData {
    constructor(data){
        ['name', 'view', 'path'].forEach(k => {
            if(!(k in data) || typeof data[k] !== 'string' || !data[k]) {
                throw new Error(`${k} is invalid.`);
            }
        });
        if(!('ctrl' in data) || typeof data.ctrl !== 'function') {
            throw new Error('ctrl is invalid');
        }

        ({name: this.name, view: this.view, ctrl: this.ctrl} = data);
    }
}

class Template {
    // constructor()
}

class Location {
    constructor() {

    }
}

class Router {
    constructor({container, routeList}){
        if(!container instanceof HTMLElement) {
            throw new Error('container is must be instance of HTMLElement');
        }
        if(!routeList || !Array.isArray(routeList) || routeList.length === 0){
            throw new Error('routeList is must be non-empty array.');
        }

        this._container = container;
        this._map = {};

        routeList.forEach(route=>{
            const routeData = new RouteData(route);
            this._map[routeData.name] = routeData;
        });

        const hashPath = window.location.hash.slice(1);
        const target = hashPath.split('/')[0];

        console.log('router is inited', hashPath, target);

        if(this._map[target]) {
            fetch(this._map[target].view)
                .then(res => res.text())
                .then(text => {
                    this._container.innerHTML = text;
                    this._map[target].ctrl();
                });
        }  

        window.onhashchange = window.onhashchange || (event => {
            const hashPath = event.newURL.slice(event.newURL.indexOf('#')+1);
            const target = hashPath.split('/')[0];

            if(this._map[target]) {
                fetch(this._map[target].view)
                    .then(res => res.text())
                    .then(html => {
                        this._container.innerHTML = html;
                        this._map[target].ctrl();
                    });
            }   
            
            console.log('hash is changed : ', target);
        });
    }
}

const homeCtrl = () => {
    console.log('im home ctrl');
};

const todosCtrl = () => {
    console.log('im todos ctrl');
};

const router = new Router({
    container: sel('.parent'),
    routeList: [
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
    ]   
    
});