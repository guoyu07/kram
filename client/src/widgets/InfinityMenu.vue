<template>
    <div class="wd-infinity-menu">
        <div v-for="item in menus" :class="'l-' + level">
            <div>
                <a v-if="!item.children"
                    :href="item.url"
                    @click.prevent.stop="open(item)"
                    :class="{active: item.key === path}"
                >{{ item.text || item.name }}</a>
                <p v-else @click="item.class.show = !item.class.show"
                    class="folder"
                    :class="item.class"
                >{{ item.text || item.name }}</p>
                <div v-if="!!(item.children && item.children.length)"
                    :class="'children-' + (level || item.level)"
                >
                    <infinity-menu :menu="item.children"
                        :level="level ? (+level + 1) : 0"
                        :collapse="collapse"
                        @expand="expand(item)"
                        @select="select"
                        :current="current"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
    @require '../common/style/variable'

    .wd-infinity-menu
        // font-size 16px
        p,
        a
            user-select none
            font-size 14px
            line-height 20px
            padding 4px 0
            color #666
            white-space normal
            text-decoration none
            display block

        .folder
            color #2c3e50
            font-weight 600
            position relative
            padding-left 15px !important
            &:before
                position absolute
                left 2px
                top 50%
                transform translateY(-50%)
                margin-top 0
                content ''
                width 0
                height 0
                border-style solid
                border-width 4px 0 4px 4px
                border-color transparent transparent transparent #808080
                transition transform .1s

        .active
            color $colorPrimaryBlue

    [class^="children-"]
        padding-left 14px
        display none

    .show+[class^="children-"]
        display block

    .show
        &.folder:before
            transform translateY(-50%) rotate(90deg)

    @media screen and (min-width: 601px)
        .wd-infinity-menu
            p,
            a
                &:hover
                    cursor pointer
                    color $colorPrimaryBlue
</style>

<script>
    export default {
        name: 'infinity-menu',
        props: ['menu', 'level', 'current', 'collapse'],
        data() {
            return {
                menus: this.menu.map(m => Object.assign(
                    {
                        'class': {
                            show: this.collapse === false
                        }
                    }, m)
                )
            };
        },
        computed: {
            path() {
                return this.$route.params.path || this.current;
            },
            hasActive() {
                return this.activeItem.length > 0;
            },
            activeItem() {
                return this.menus.filter(item => item.key === this.path);
            }
        },
        watch: {
            menu(val) {
                this.menus = val.map(m => Object.assign(
                    {
                        'class': {
                            show: this.collapse === false
                        }
                    }, m)
                );
                if (this.hasActive) {
                    this.$emit('expand');
                }
            }
        },
        methods: {
            open(item) {
                if (item.key) {
                    this.$emit('select', item);
                    this.$nextTick(() => {
                        this.$router.push(item.url);
                    });
                }
                else {
                    window.open(item.url);
                }
            },
            expand(item) {
                item.class.show = true;
                this.$emit('expand');
            },
            select(item) {
                this.$emit('select', item);
            }
        },
        mounted() {
            if (this.hasActive) {
                this.$emit('expand');
            }
        }
    };
</script>