<html>
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <script type="text/javascript" language="javascript" src="https://code.jquery.com/jquery-3.3.1.js"></script>
    <link href="dist/css/semantic-ui/tabulator_semantic-ui.min.css" rel="stylesheet">
    <link href="https://unpkg.com/tabulator-tables@4.6.2/dist/css/tabulator.min.css" rel="stylesheet">
<script type="text/javascript" src="https://unpkg.com/tabulator-tables@4.6.2/dist/js/tabulator.min.js"></script>
<script type="text/javascript" src="https://oss.sheetjs.com/sheetjs/xlsx.full.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.5/jspdf.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.0.5/jspdf.plugin.autotable.js"></script>
</head>
<body>
    <div>
    <button id="ajax-trigger">Load Data via AJAX</button>
</div>

<div>

  

<div>
    <button id="download-csv">Download CSV</button>
    <button id="download-json">Download JSON</button>
    <button id="download-xlsx">Download XLSX</button>
    <button id="download-pdf">Download PDF</button>
    <button id="download-html">Download HTML</button>
</div>


<div id="example-table"></div>

    <script>
//custom max min header filter
var minMaxFilterEditor = function(cell, onRendered, success, cancel, editorParams){

    var end;

    var container = document.createElement("span");

    //create and style inputs
    var start = document.createElement("input");
    start.setAttribute("type", "number");
    start.setAttribute("placeholder", "Min");
    start.setAttribute("min", 0);
    start.setAttribute("max", 100);
    start.style.padding = "4px";
    start.style.width = "50%";
    start.style.boxSizing = "border-box";

    start.value = cell.getValue();

    function buildValues(){
        success({
            start:start.value,
            end:end.value,
        });
    }

    function keypress(e){
        if(e.keyCode == 13){
            buildValues();
        }

        if(e.keyCode == 27){
            cancel();
        }
    }

    end = start.cloneNode();
    end.setAttribute("placeholder", "Max");

    start.addEventListener("change", buildValues);
    start.addEventListener("blur", buildValues);
    start.addEventListener("keydown", keypress);

    end.addEventListener("change", buildValues);
    end.addEventListener("blur", buildValues);
    end.addEventListener("keydown", keypress);


    container.appendChild(start);
    container.appendChild(end);

    return container;
 }

//custom max min filter function
function minMaxFilterFunction(headerValue, rowValue, rowData, filterParams){
        if(rowValue){
            if(headerValue.start != ""){
                if(headerValue.end != ""){
                    return rowValue >= headerValue.start && rowValue <= headerValue.end;
                }else{
                    return rowValue >= headerValue.start;
                }
            }else{
                if(headerValue.end != ""){
                    return rowValue <= headerValue.end;
                }
            }
        }

    return true; 
}

// BUTONLAR
//trigger download of data.csv file
document.getElementById("download-csv").addEventListener("click", function(){
    table.download("csv", "data.csv");
});

//trigger download of data.json file
document.getElementById("download-json").addEventListener("click", function(){
    table.download("json", "data.json");
});

//trigger download of data.xlsx file
document.getElementById("download-xlsx").addEventListener("click", function(){
    table.download("xlsx", "data.xlsx", {sheetName:"My Data"});
});

//trigger download of data.pdf file
document.getElementById("download-pdf").addEventListener("click", function(){
    table.download("pdf", "data.pdf", {
        orientation:"portrait", //set page orientation to portrait
        title:"Example Report", //add title to report
    });
});

//trigger download of data.html file
document.getElementById("download-html").addEventListener("click", function(){
    table.download("html", "data.html", {style:true});
});

// TABULATOR

var table = new Tabulator("#example-table", {
    
    layout:"fitColumns",
 
     pagination:"local",
    paginationSize:50,
    paginationSizeSelector:[3, 6, 8, 200],
    movableColumns:true,
     responsiveLayout:"collapse",


    columns:[
        {formatter:"rowSelection", titleFormatter:"rowSelection", width:30, hozAlign:"center", headerSort:false, cellClick:function(e, cell){cell.getRow().toggleSelect(); }},
        {formatter:printIcon, width:40, hozAlign:"center", cellClick:function(e, cell){alert("Printing row data for: " + cell.getRow().getData().name)}},
        {title:"name", field:"name", sorter:"string", width:200, headerFilter:"input", cellClick:function(e, cell){alert(cell.getRow().getData().name+'asdas')}},
        {title:"tedarikciID", field:"tedarikciID", sorter:"string", width:200, headerFilter:minMaxFilterEditor, headerFilterFunc:minMaxFilterFunction},
        {title:"tedarikciCode", field:"tedarikciCode", sorter:"string", width:200, headerFilter:minMaxFilterEditor, headerFilterFunc:minMaxFilterFunction},
        {title:"markaID", field:"markaID", sorter:"string", editor:"input", headerFilter:"select", headerFilterParams:{values:true}},
        {title:"catID", field:"catID", sorter:"string", editor:"input", headerFilter:"select", headerFilterParams:{values:true}},
       
        {title:"fiyat", field:"fiyat", sorter:"string", width:200, headerFilter:minMaxFilterEditor, headerFilterFunc:minMaxFilterFunction,  topCalc:"sum", topCalcParams:{precision:3}},
        {title:"kur", field:"kur", sorter:"string", width:200, headerFilter:minMaxFilterEditor, headerFilterFunc:minMaxFilterFunction},
       
    ],
  
   
});

var printIcon = function(cell, formatterParams){ //plain text value
    return "Print";
};


table.setData("list.php");
    </script>
</body>
</html>