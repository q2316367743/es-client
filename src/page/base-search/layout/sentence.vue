<template>
    <div class="base-search-condition-sentence">
        <show-query-condition/>
        <a-button type="text" @click="jumpToSeniorSearch">
            {{ $t('common.action.jumpToSeniorSearch') }}
        </a-button>
        <a-button type="text" @click="execCopy">
            {{ $t('common.action.copy') }}
        </a-button>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import ShowQueryCondition from "@/page/base-search/components/tool/ShowQueryCondition.vue";
import {usePageJumpEvent, useSeniorSearchEvent} from "@/global/BeanFactory";
import PageNameEnum from "@/enumeration/PageNameEnum";
import QueryConditionBuild from "@/page/base-search/algorithm/QueryConditionBuild";
import MessageUtil from "@/utils/MessageUtil";
import {mapState} from "pinia";
import {useBaseSearchStore} from "@/store/components/BaseSearchStore";

export default defineComponent({
    name: 'base-search-sentence',
    components: {ShowQueryCondition},
    data: () => ({}),
    computed: {
        ...mapState(useBaseSearchStore, ['current'])
    },
    methods: {
        jumpToSeniorSearch() {
            usePageJumpEvent.emit(PageNameEnum.SENIOR_SEARCH);
            try {
                useSeniorSearchEvent.emit({
                    link: `/${this.current.index}/_search`,
                    method: 'POST',
                    params: JSON.stringify(
                            QueryConditionBuild(this.current.conditions, this.current.page, this.current.size, this.current.orders),
                            null,
                            4)
                });
            } catch (e) {
                MessageUtil.error('条件构造错误', e);
            }
        },
        execCopy() {
            (this.$refs['baseSearchDataView'] as any).execCopy()
        },
    }
});
</script>
<style scoped>

</style>
