/**
 * @license
 * Copyright 2018 Nodier Torres. All rights reserved.
 * 
 * Copyrights licensed under the terms of the MIT license.
 * Original source <https://github.com/NOD507/SenseDateRangePicker>
 */
define(["qlik","jquery","./lib/moment.min","./calendar-settings","css!./lib/daterangepicker.css","./lib/daterangepicker"],
function(qlik,$,moment,CalendarSettings)
{"use strict";
console.log(qlik);
/*console.log('Hello, World!');*/
function createDate(num) {
    var d=new Date(86400*(num-25569)*1e3);
    return""+d.getFullYear()+("0"+(d.getMonth()+1)).slice(-2)+("0"+d.getDate()).slice(-2)
}
function createMoment(str,format) {
    const mom = isNaN(str)?moment(str,format):moment(createDate(str),"YYYYMMDD");
    //console.log(mom);
    return mom;
}
function getFieldName(str){
    return"="===str[0]&&(str=str.substr(1)),str
}
function createRanges(props){
    var ranges={};
    return ranges[props.today]=[
        moment().startOf("day"),
        moment().startOf("day")],
        ranges[props.yesterday]=[moment().subtract(1,"days"),
        moment().subtract(1,"days")],
        ranges[props.tomorrow]=[moment().add(1,"days"),
        moment().add(1,"days")],
        ranges[props.lastXDays.replace("$","2")]=[moment().subtract(1,"days"), moment().startOf("day")],
        ranges[props.lastXDays.replace("$","7")]=[moment().subtract(6,"days"), moment()],
        ranges[props.lastXDays.replace("$","30")]=[moment().subtract(29,"days"),moment()],
        ranges[props.thisMonth]=[moment().startOf("month"),moment().endOf("month")],
        ranges[props.lastMonth]=[
            moment().subtract(1,"month").startOf("month"),moment().subtract(1,"month").endOf("month")
        ],ranges
    }
        function createDateStates(pages){
            var dateStates={};
            return pages.forEach(function(page){
                page.qMatrix.forEach(function(row){
                    var d=createDate(row[0].qNum);
                    dateStates[d]=row[0].qState,"S"===row[0].qState&&(dateStates.rangeStart=dateStates.rangeStart||row[0].qNum,dateStates.rangeEnd=row[0].qNum)})}),dateStates
                }
                function createHtml(dateStates,DateFormat,props){
                    var html="<div>";
                    return html+='<div class="bootstrap_inside pull-right show-range" >',
                    html+='   <i class="lui-icon lui-icon--calendar"></i>&nbsp;<span>',
                    dateStates.rangeStart
                    ?(html+=createMoment(dateStates.rangeStart).format(DateFormat),
                    dateStates.rangeEnd&&dateStates.rangeEnd!==dateStates.rangeStart&&(html+=props.separator+createMoment(dateStates.rangeEnd).format(DateFormat)))
                    :html+=props.defaultText,html+='</span> <b class="lui-button__caret lui-caret"></b>',
                    html+="</div>",html+="</div>"
                }
                return{
                    methods:{
                        createDate:createDate,
                        createMoment:createMoment,
                        getFieldName:getFieldName,
                        createRanges:createRanges,
                        createDateStates:createDateStates,
                        createHtml:createHtml
                    },
                    initialProperties:{
                        version:1,
                        qListObjectDef:{
                            qShowAlternatives:!0,
                            qFrequencyMode:"V",
                            qSortCriterias:{
                                qSortByNumeric:1,
                                qSortByState:1
                            },
                                qInitialDataFetch:[
                                    {qWidth:2,qHeight:5e3}]
                                },
                                    advanced:!1
                                },
                                    definition:CalendarSettings,
                                    support:{snapshot:!0,
                                        export:!0,
                                        exportData:!1
                                    },
                                        paint:function($element,layout){
                                            console.log(layout);
                                            var self=this;
                                            this.dateStates=createDateStates(layout.qListObject.qDataPages),self.app||(self.app=qlik.currApp(this));
                                            var qlikDateFormat=layout.qListObject.qDimensionInfo.qNumFormat.qFmt;
                                            var DateFormat=layout.props.format||qlikDateFormat;
                                            moment.locale(layout.props.locale);
                                            var minDate=createMoment(layout.props.minDate,qlikDateFormat);
                                            //console.log('minData = ');
                                            //console.log(minDate);
                                            var maxDate=createMoment(layout.props.maxDate,qlikDateFormat);
                                            var startDate=createMoment(layout.props.startDate,qlikDateFormat);
                                            $("#dropDown_"+layout.qInfo.qId).remove(),
                                            $element.html(createHtml(this.dateStates,DateFormat,layout.props));
                                            var config={
                                                singleDatePicker:layout.props.isSingleDate,
                                                timePicker: true,
                                                timePicker24Hour: true,
                                                locale:{
                                                    format:DateFormat,
                                                    //format: 'M/DD hh:mm A',
                                                    separator:layout.props.separator,
                                                },
                                                parentEl:"#grid",
                                                autoUpdateInput:!1,
                                                autoApply:!0,
                                                opens:$element.offset().left<500
                                                ?"right":"left",id:layout.qInfo.qId,getClass:
                                                function(date){
                                                    var d=date.format("YYYYMMDD");
                                                    return self.dateStates[d]
                                                    ?"state"+self.dateStates[d]
                                                    :"nodata"
                                                }
                                            };
                                            minDate.isValid()&&(config.minDate=minDate),maxDate.isValid()&&(config.maxDate=maxDate),startDate.isValid()
                                            ?config.startDate=startDate
                                            :config.startDate=config.minDate,layout.props.CustomRangesEnabled&&(config.locale.customRangeLabel=layout.props.customRangeLabel,config.ranges=createRanges(layout.props)),$element.find(".show-range")
                                            .daterangepicker(config,function(pickStart,pickEnd,label){
                                                pickStart.isValid()&&pickEnd.isValid()&&self.app
                                                .field(getFieldName(layout.qListObject.qDimensionInfo.qGroupFieldDefs[0]),layout.qListObject.qStateName)
                                                .selectMatch(">="+pickStart.format(qlikDateFormat)+"<="+pickEnd.format(qlikDateFormat))})
                                        }}});