<template>
  <el-row
    class="filter-header"
    style="display:flex;align-items:center;"
    width="100%"
    v-if="col.filter"
  >
    <el-dropdown trigger="click" :hide-on-click="true" style @command="handleCommand">
      <span class="el-dropdown-link">{{symbols[queryData[col.prop + "Cond"]]}}</span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="con in mergeCondition(col.filter)"
          :key="con"
          :command="composeValue(con,col)"
        >{{symbols[con] + shownames[con]}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-input
      v-if="col.filter.type == 'text'"
      v-model="queryData[col.prop]"
      :maxlength="col.filter.maxlength"
      :clearable="col.filter.clearable"
      :disabled="col.filter.disabled"
      size="mini"
      style="padding:0px;flex:1;"
      @keyup.enter.native="onQuery"
    />
    <el-input-number
      v-model="queryData[col.prop]"
      v-else-if="col.filter.type == 'number'"
      :min="col.filter.min"
      :max="col.filter.max"
      :controls="col.filter.controls"
      :step="col.filter.step"
      :precision="col.filter.precision"
      size="mini"
      :disabled="col.filter.disabled"
      controls-position="right"
      style="padding:0px;flex:1;"
      @keyup.enter.native="onQuery"
    />
    <el-select
      v-model="queryData[col.prop]"
      v-else-if="col.filter.type == 'select'"
      :clearable="col.filter.clearable"
      :filterable="col.filter.filterable"
      :disabled="col.filter.disabled"
      :collapse-tags="col.filter.collapsetags"
      size="mini"
      style="padding:0px;flex:1;"
      placeholder
      @keyup.enter.native="onQuery"
      @change="query(col.filter.changeQuery)"
    >
      <el-option
        v-for="item in col.filter.options"
        :key="item.value + '.' + Math.random()"
        :value="item.value"
        :label="item.label"
      ></el-option>
    </el-select>
    <el-select
      v-model="queryData[col.prop]"
      v-else-if="col.filter.type == 'multiselect'"
      multiple
      :clearable="col.filter.clearable"
      :filterable="col.filter.filterable"
      :disabled="col.filter.disabled"
      :collapse-tags="col.filter.collapsetags"
      :multiple-limit="col.filter.multiplelimit"
      size="mini"
      style="padding:0px;flex:1;"
      placeholder
      @keyup.enter.native="onQuery"
      @change="query(col.filter.changeQuery)"
    >
      <el-option
        v-for="item in col.filter.options"
        :key="item.value + '.' + Math.random()"
        :value="item.value"
        :label="item.label"
      ></el-option>
    </el-select>
    <el-date-picker
      v-else-if="col.filter.type == 'date'"
      v-model="queryData[col.prop]"
      type="daterange"
      range-separator="~"
      size="mini"
      :disabled="col.filter.disabled"
      :editable="col.filter.editable"
      :clearable="col.filter.clearable"
      @keydown.enter.native="onQuery"
      @change="query(col.filter.changeQuery)"
      :value-format="dateFormat"
      :format="dateFormat"
    ></el-date-picker>
    <el-date-picker
      v-else-if="col.filter.type == 'datetime'"
      v-model="queryData[col.prop]"
      type="datetimerange"
      range-separator="~"
      size="mini"
      :disabled="col.filter.disabled"
      :editable="col.filter.editable"
      :clearable="col.filter.clearable"
      @keydown.enter.native="onQuery"
      @change="query(col.filter.changeQuery)"
      :value-format="dateFormat + ' ' + timeFormat"
      :format="dateFormat + ' ' + timeFormat"
      :default-time="['00:00:00', '23:59:59']"
    ></el-date-picker>
    <template v-else-if="col.filter.type == 'component'">
      <component
        :is="col.filter.component"
        v-bind="componentBind(col.filter.bind)"
        v-on="componentEvent(col.filter.event || null)"
      ></component>
    </template>
    <el-input v-else :disabled="true" v-model="queryData[col.prop]" size="mini" />
  </el-row>
</template>
<script>
import { getProfile } from '@/portal/utils/auth'

export default {
  name: 'FilterHeaderColumn',
  data: function () {
    return {
      conditions: {
        "date": ["bt"],
        "datetime": ["bt"],
        "select": ["eq", "ne"],
        "multiselect": ["me"],
        "text": ["cn", "eq", "ne", "bw", "ew"],
        "number": ["eq", "ne", "gt", "ge", "lt", "le"],
      },
      symbols: {
        "bt": "‐‐",
        "cn": "~",
        "eq": "==",
        "ne": "!=",
        "me": "||",
        "bw": "^",
        "ew": "|",
        "gt": ">",
        "ge": ">=",
        "lt": "<",
        "le": "<="
      },
      shownames: {
        "bt": this.$t('components.condition.bt'),
        "cn": this.$t('components.condition.cn'),
        "eq": this.$t('components.condition.eq'),
        "ne": this.$t('components.condition.ne'),
        "me": this.$t('components.condition.me'),
        "bw": this.$t('components.condition.bw'),
        "ew": this.$t('components.condition.ew'),
        "gt": this.$t('components.condition.gt'),
        "ge": this.$t('components.condition.ge'),
        "lt": this.$t('components.condition.lt'),
        "le": this.$t('components.condition.le')
      },
      dateFormat: getProfile().__dateFormat,
      timeFormat: getProfile().__timeFormat
    }
  },
  beforeCreate() {
  },
  props: {
    queryData: { // 查询参数
      type: Object,
      default: function () {
        return {}
      }
    },
    col: {
      type: Object,
      default: function () {
        return {}
      }
    },
    onQuery: { // 触发查询
      type: Function,
      default: () => { }
    },
  },
  methods: {
    query(changeQuery) {
      // debugger
      if (this.$root.TABLE_VIEW_CHANGE_QUERY === false)
        return

      if (changeQuery === undefined || changeQuery === null || changeQuery === true)
        this.onQuery()
    },
    composeValue(symbol, col) {
      let o = { "symbol": symbol, "col": col }
      return o;
    }, handleCommand(command) {
      this.queryData[command.col.prop + "Cond"] = command.symbol
      if (this.queryData[command.col.prop] && (command.col.type == 'number' || this.queryData[command.col.prop].length > 0)) {
        this.onQuery()
      }
    },
    // 绑定属性
    componentBind(bind) {
      if (typeof bind == 'function') {
        return bind(this)
      } else {
        return bind
      }
    },
    // 绑定事件
    componentEvent(event) {
      if (typeof event == 'function') {
        return event(this)
      }
    }
  },
  computed: {
    mergeCondition(f) {
      return function (f) {
        if (f.conditions && !(f.type === 'date' || f.type === 'datetime' || f.type === 'multiselect')) { // 日期、时间、多选框的比较符固定，不可定制
          return this.conditions[f.type].filter(function (v) { return f.conditions.indexOf(v) > -1 }) // 自定义比较符需要合法性过滤
        } else {
          return this.conditions[f.type]
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-header /deep/ {
  .el-input--suffix .el-input__inner {
    padding: 0 5px;
  }
}
</style>
