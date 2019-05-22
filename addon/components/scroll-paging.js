import Component from '@ember/component';
import EmberObject, { observer } from '@ember/object';
import layout from '../templates/components/scroll-paging';
import { A } from '@ember/array';
import { next } from '@ember/runloop';

export default Component.extend({
    layout,
    classNames: ['scroll-paging'],
    onRequestPage: null, //(pageIndex, pageSize)=>[].count
    pageSize: 10,
    itemHeight: 30,
    needRefresh: false,

    pages: null,

    onRefresh: observer('needRefresh', function(){
        if(this.get('needRefresh') === true){
            let pages = A();
            pages.pushObject(EmberObject.create({
                pageIndex: 0,
                itemsCount: 1
            }));
            this.set('pages', pages);
            next(()=>{
                this.refreshCompleted();
            });
        }
    }),

    init(){
        this._super(...arguments);
        let pages = A();
        pages.pushObject(EmberObject.create({
            pageIndex: 0,
            itemsCount: 1
        }));
        this.set('pages', pages);
    },

    actions: {
        requestPageInternal(pageIndex){
            let pageSize = this.get('pageSize');
            this.onRequestPage(pageIndex, pageSize).then(items=>{
                if(!this.isDestroyed){
                    let count = items.count;
                    this.set('count', items.count);
                    let pagesCount = Math.ceil(count/pageSize);
                    this.addOrRemovePages(pagesCount);
                    this.correctItemsCount();
                    this.setItems(pageIndex, items);
                }
            });
        },
    },

    setItems(pageIndex, items){
        let pages = this.get('pages');
        pages[pageIndex].set('items', items);
    },

    correctItemsCount(){
        let pages = this.get('pages');
        let pageSize = this.get('pageSize');
        let count = this.get('count');
        for(let i = 0; i<pages.length; i++){
            let isLast = (i === pages.length -1);
            if(isLast){
                let lastCount =(isLast ? (count - (pages.length-1)*pageSize): pageSize);
                if(lastCount!==pages[i].get('itemsCount')){
                    pages[i].set('itemsCount', lastCount);
                }
            }else{
                if(pages[i].get('itemsCount')!==pageSize){
                    pages[i].set('itemsCount', pageSize);
                }
            }
        }
    },

    addOrRemovePages(pagesCount){
        let pages = this.get('pages');
        if(pages.length<pagesCount){
            let startIndex = pages.length;
            for(let i = startIndex; i<pagesCount; i++){
                pages.pushObject(EmberObject.create({
                    pageIndex: i,
                }));
            }
        }else if(pages.length<pagesCount){
            let countToRemove = pagesCount - pages.length;
            for(let i = 0; i<countToRemove; i++){
                pages.removeObject(pages.get('lastObject'));
            }
        }
    }
});
