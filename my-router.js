const sel = s => document.querySelector(s);

class RouteData {
    constructor(data){
        ['view', 'path'].forEach(k => {
            if(!(k in data) || typeof data[k] !== 'string' || !data[k]) {
                throw new Error(`${k} is invalid.`);
            }
        });
        if(!('ctrl' in data) || typeof data.ctrl !== 'function') {
            throw new Error('ctrl is invalid');
        }

        ({path: this.path, view: this.view, ctrl: this.ctrl} = data);
    }
}

class ViewLoader {
    async load(url){
        if(!url || typeof url !== 'string') {
            throw new Error('url of view is must be string');
        }
        const res = await fetch(url);
        return await res.text();
    }
}

const Router = (_=>{
    const Private = Symbol();
    return class {
        constructor({container, routeList}){
            if(!container instanceof HTMLElement) {
                throw new Error('container is must be instance of HTMLElement');
            }
            if(!routeList || !Array.isArray(routeList) || routeList.length === 0){
                throw new Error('routeList is must be non-empty array.');
            }
    
            this[Private] = {};
            this[Private].container = container;
            this[Private].viewLoader = new ViewLoader();
            this[Private].map = routeList.reduce((map, route) => {
                const routeData = new RouteData(route);
                this[Private].map[routeData.path] = routeData;
                return this[Private].map;
            }, this[Private].map = {});

            this._change();
    
            window.addEventListener('hashchange', event => {
                this._change();
            });
        }

        _change(){
            const hashPath = window.location.hash.slice(1);
            const target = hashPath.split('/')[0];

            this[Private].viewLoader.load(
                this[Private].map[target].view
            ).then(html => {
                this[Private].container.innerHTML = html;
                this[Private].map[target].ctrl();
            });
        }
    }
})();

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
            path: 'home',
            view: 'views/home.html',
            ctrl: homeCtrl
        },
        {
            path: 'todos',
            view: 'views/todos.html',
            ctrl: todosCtrl
        }
    ]
});