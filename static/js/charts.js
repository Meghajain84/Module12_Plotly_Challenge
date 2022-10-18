function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleData = data.samples;
    var metaData = data.metadata;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = sampleData.filter(sampleObj => sampleObj.id == sample);
    var resultArrayMeta = metaData.filter(sampleObj => sampleObj.id == sample);
    // 5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    var resultMeta = resultArrayMeta[0];
    
     // Deliverable 1
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values
    var otu_Ids = result.otu_ids;
    var otu_Labels = result.otu_labels;
    var sample_Values = result.sample_values;    

    // these below variables are used in deliverable 1 specifically for top 10
    var otuIds = result.otu_ids.slice(0,10).reverse();
    var otuLabels = result.otu_labels.slice(0,10).reverse();
    var sampleValues = result.sample_values.slice(0,10).reverse();

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    // so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.map(id => "OTU " + id);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues,
      y: yticks,
      type: "bar",
      orientation: "h",
      text: otuLabels
  }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>"      
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Deliverable 2
    // 11. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_Ids,
      y: sample_Values,
      text: otu_Labels,
      mode: "markers",
      marker: {
        color: otu_Ids,
        size: sample_Values,
        colorscale: "Earth"
      }
    }   
    ];
    
    // 12. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {text: "<b>Bacteria Cultures Per Sample</b>"},
      xaxis: {title: "OTU ID"},
      hovermode: "closest"    
    };
    
    // 13. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData, bubbleLayout ); 

    //Deliverable 3
    // variable used in gauge map
    var wfreq = parseFloat(resultMeta.wfreq);
    // 14. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wfreq,
      title: {text: "<b> Belly Button Washing Frequency </b> <br> Scrubs Per Week</br>"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null,10], dtick: "2"},
        bar: {color: "black"},
        steps: [
          {range: [0,2], color: "violet"},
          {range: [2,4], color: "indigo"},
          {range: [4,6], color: "green"},
          {range: [6,8], color: "yellow"},
          {range: [8,10], color: "orange"}
        ]
      }
    }
    ];
      
    // 15. Create the layout for the gauge chart.
    var gaugeLayout = { 
      automargin: false
    };
  
    // 16. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout)
  });
}
