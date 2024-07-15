let covidData;

// Load the dataset from the GitHub repository
d3.csv("https://raw.githubusercontent.com/joelfeddes2000/narrative-visualization/gh-pages/covid19countrywise.csv").then(data => {
    console.log("Data loaded:", data);  // Debugging statement
    covidData = data;
    // Initialize the first scene
    sceneDeathsRegion();
}).catch(error => {
    console.error("Error loading the data:", error);
});

function clearVisualization() {
    d3.select("#visualization").selectAll("*").remove();
    d3.selectAll(".nav-button").classed("active", false);
}

function activateButton(buttonId) {
    d3.select(`#${buttonId}`).classed("active", true);
}

function showButton(buttonId) {
    d3.select(`#${buttonId}`).classed("hidden", false);
}

// Scene: Deaths x Region
function sceneDeathsRegion() {
    clearVisualization();
    activateButton("btn-deaths-region");
    if (!covidData) {
        console.error("No data available for Scene Deaths x Region");
        return;
    }
    console.log("Scene Deaths x Region data:", covidData);  // Debugging statement
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", 1200)
        .attr("height", 600);

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    const margin = { top: 20, right: 30, bottom: 150, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const data = Array.from(d3.group(covidData, d => d.Region), ([key, value]) => ({ key, value: d3.sum(value, d => +d["Total Deaths"]) }));
    console.log("Scene Deaths x Region processed data:", data);  // Debugging statement

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.key))
        .range([0, innerWidth])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .nice()
        .range([innerHeight, 0]);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.key))
        .attr("y", d => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(d.value))
        .attr("fill", "steelblue");

    g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    g.append("g")
        .call(d3.axisLeft(yScale));

    // X axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", margin.left + innerWidth / 2)
        .attr("y", height - 60)
        .text("Region");

    // Y axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", -(margin.top + innerHeight / 2))
        .attr("y", 20)
        .attr("transform", "rotate(-90)")
        .text("Total Deaths");

    // Make the next button visible
    showButton("btn-deaths-country");
}

// Scene: Deaths x Country
function sceneDeathsCountry() {
    clearVisualization();
    activateButton("btn-deaths-country");
    if (!covidData) {
        console.error("No data available for Scene Deaths x Country");
        return;
    }
    console.log("Scene Deaths x Country data:", covidData);  // Debugging statement
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", 1800)
        .attr("height", 600);

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    const margin = { top: 20, right: 30, bottom: 150, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const data = covidData.sort((a, b) => d3.descending(+a["Total Deaths"], +b["Total Deaths"])).slice(0, 20);
    console.log("Scene Deaths x Country processed data:", data);  // Debugging statement

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.Country))
        .range([0, innerWidth])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d["Total Deaths"])])
        .nice()
        .range([innerHeight, 0]);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.Country))
        .attr("y", d => yScale(+d["Total Deaths"]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(+d["Total Deaths"]))
        .attr("fill", "steelblue");

    g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    g.append("g")
        .call(d3.axisLeft(yScale));

    // X axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", margin.left + innerWidth / 2)
        .attr("y", height - 60)
        .text("Country");

    // Y axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", -(margin.top + innerHeight / 2))
        .attr("y", 20)
        .attr("transform", "rotate(-90)")
        .text("Total Deaths");

    // Make the next button visible
    showButton("btn-cases-country");
}

// Scene: Cases x Country
function sceneCasesCountry() {
    clearVisualization();
    activateButton("btn-cases-country");
    if (!covidData) {
        console.error("No data available for Scene Cases x Country");
        return;
    }
    console.log("Scene Cases x Country data:", covidData);  // Debugging statement
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", 1800)
        .attr("height", 600);

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    const margin = { top: 20, right: 30, bottom: 150, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const data = covidData.sort((a, b) => d3.descending(+a["Total Cases"], +b["Total Cases"])).slice(0, 20);
    console.log("Scene Cases x Country processed data:", data);  // Debugging statement

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.Country))
        .range([0, innerWidth])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d["Total Cases"])])
        .nice()
        .range([innerHeight, 0]);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.Country))
        .attr("y", d => yScale(+d["Total Cases"]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(+d["Total Cases"]))
        .attr("fill", "steelblue");

    g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    g.append("g")
        .call(d3.axisLeft(yScale));

    // X axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", margin.left + innerWidth / 2)
        .attr("y", height - 60)
        .text("Country");

    // Y axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", -(margin.top + innerHeight / 2))
        .attr("y", 20)
        .attr("transform", "rotate(-90)")
        .text("Total Cases");

    // Make the next button visible
    showButton("btn-cases-country-details");
}

// Scene: Cases x Country Details
function sceneCasesCountryDetails() {
    clearVisualization();
    activateButton("btn-cases-country-details");
    if (!covidData) {
        console.error("No data available for Scene Cases x Country Details");
        return;
    }
    console.log("Scene Cases x Country Details data:", covidData);  // Debugging statement
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", 1800)
        .attr("height", 600);

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;
    const margin = { top: 20, right: 30, bottom: 150, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const data = covidData.sort((a, b) => d3.descending(+a["Total Cases"], +b["Total Cases"])).slice(0, 20);
    console.log("Scene Cases x Country Details processed data:", data);  // Debugging statement

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.Country))
        .range([0, innerWidth])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d["Total Cases"])])
        .nice()
        .range([innerHeight, 0]);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.Country))
        .attr("y", d => yScale(+d["Total Cases"]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(+d["Total Cases"]))
        .attr("fill", "steelblue")
        .on("mouseover", function(event, d) {
            d3.select(this)
                .attr("fill", "orange");

            const [x, y] = d3.pointer(event);
            g.append("text")
                .attr("id", "tooltip")
                .attr("x", x + 10)
                .attr("y", y - 10)
                .attr("fill", "black")
                .text(`Cases: ${d["Total Cases"]}, Deaths: ${d["Total Deaths"]}`);
        })
        .on("mouseout", function() {
            d3.select(this)
                .attr("fill", "steelblue");

            g.select("#tooltip").remove();
        });

    g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    g.append("g")
        .call(d3.axisLeft(yScale));

    // X axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", margin.left + innerWidth / 2)
        .attr("y", height - 60)
        .text("Country");

    // Y axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", -(margin.top + innerHeight / 2))
        .attr("y", 20)
        .attr("transform", "rotate(-90)")
        .text("Total Cases");
}

// Initialize the first scene
sceneDeathsRegion();


