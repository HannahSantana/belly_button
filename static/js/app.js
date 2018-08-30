function buildMetadata(thisSample) {


  // what sample are we using here
  let metadata = "/metadata/" + thisSample

  let thisSelector = d3.select("#sample-metadata");
  thisSelector.selectAll("p").remove();

  d3.json(metadata).then(function (response, error) {
    console.log(response)
    Object.entries(response).forEach(([key, value]) => {
      thisSelector.append("p").text(key + " " + value);
    })

    // pull the properties you need into variables
    // put those onto DOM elements
    // select the element with d3 d3.html(`<li>${Var}</li>`)
  })
}


// @TODO: Complete the following function that builds the metadata panel

// Use `d3.json` to fetch the metadata for a sample
// Use d3 to select the panel with id of `#sample-metadata`

// Use `.html("") to clear any existing metadata

// Use `Object.entries` to add each key and value pair to the panel
// Hint: Inside the loop, you will need to use d3 to append new
// tags for each key-value in the metadata.

// BONUS: Build the Gauge Chart
// buildGauge(data.WFREQ);


function buildCharts(sample) {
  d3.json(`/samples/${sample}`)
    .then(response => {
      var data = [{
        values: response.sample_values.slice(0,11),
        labels: response.otu_ids.slice(0,11),
        type: 'pie',
        text: response.otu_labels,
      }];
      
      var layout = {
        title: 'Pie Chart',
        height: 400,
        width: 500
      };
      
      Plotly.newPlot('pie', data, layout);
      console.log(response)
    })


  d3.json(`/samples/${sample}`)
    .then(response => {
      var trace2 = {
        x: response.otu_ids,
        y: response.sample_values,
        mode: 'markers',
        marker: {
          color: response.otu_ids,
          size: response.sample_values
        },
        text: response.otu_labels
      };

      var data = [trace2];

      var layout = {
        title: 'Bubble Graph',
        showlegend: false,
        height: 600,
        width: 1400
      };

      Plotly.newPlot('bubble', data, layout);
      console.log(response)
    })
}




  // @TODO: Use `d3.json` to fetch the sample data for the plots

  // @TODO: Build a Bubble Chart using the sample data

  // @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).




function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  console.log(selector)

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    console.log(firstSample)
    buildCharts(firstSample);// 
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
