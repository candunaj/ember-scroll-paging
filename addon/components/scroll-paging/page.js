import Component from '@ember/component';
import { observer, computed } from '@ember/object';
import layout from '../../templates/components/scroll-paging/page';
import { oneWay } from '@ember/object/computed';

export default Component.extend({
    tagName: '',
    layout,
    visible: false,

    items: oneWay('page.items'),
    itemsCount: oneWay('page.itemsCount'),
    pageIndex: oneWay('page.pageIndex'),

    itemHeight: 30,
    requestPage: null,

    onRefresh: observer('items', 'visible', function(){
        let items = this.get('items');
        let visible = this.get('visible');

        if(!items && visible){
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

    height: computed('itemHeight', 'itemsCount', 'visible', function(){
        if(this.get('visible')){
            return '';
        }

        let height = this.get('itemHeight') * this.get('itemsCount');
        return `height: ${height}px;`;
    }),
});
