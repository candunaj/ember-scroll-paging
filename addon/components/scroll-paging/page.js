import Component from '@ember/component';
import { observer, computed } from '@ember/object';
import layout from '../../templates/components/scroll-paging/page';
import { oneWay, alias } from '@ember/object/computed';

export default Component.extend({
    tagName: '',
    layout,
    visible: false,
    height: null,

    items: oneWay('page.items'),
    itemsCount: oneWay('page.itemsCount'),
    pageIndex: oneWay('page.pageIndex'),
    loading: oneWay('page.loading'),

    itemHeight: 30,
    requestPage: null,

    onRefresh: observer('items', 'visible', 'page.needRefresh', 'loading', function(){
        let items = this.get('items');
        let visible = this.get('visible');
        let needRefresh = this.get('page.needRefresh');
        let loading = this.get('loading');

        if((!items || needRefresh) && visible && !loading){
            this.set('page.loading', true);
            this.set('page.needRefresh', false);
            this.requestPage(this.get('pageIndex'));
        }
    }),

    loadingItems: computed('itemsCount', function(){
        let result = [];
        let itemsCount = this.get('itemsCount');
        for(let i=0;i<itemsCount;i++){
            result.push(0);
        }
        return result;
    }),

    heightStyle: computed('itemHeight', 'itemsCount', 'visible', 'height', function(){
        if(this.get('visible')){
            return '';
        }

        let height = this.get('height') || this.get('itemHeight') * this.get('itemsCount');
        return `height: ${height}px;`;
    }),

    actions: {
        setHeight(height){
            this.set('height', height);
        },

        enterViewport(){
            this.set('visible', true);
        }
    }
});
