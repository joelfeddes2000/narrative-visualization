let covidData;

// Load the dataset from the GitHub repository
d3.csv("https://raw.githubusercontent.com/joelfeddes2000/narrative-visualization/gh-pages/covid19countrywise.csv").then(data => {
    console.log("Data loaded:", data);  // Debugging statement
    covidData = data;
    // Initialize the first scene
    scene1();
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

// Scene 1: Introduction to global COVID-19 statistics by country
function scene1() {
    clearVisualization();
    activateButton("btn-scene1");
    if (!covidData) {
        console.error("No data available for Scene 1");
        return;
    }
    console.log("Scene 1 data:", covidData);  // Debugging statement
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    const data = covidData.sort((a, b) => d3.descending(+a["Total Cases"], +b["Total Cases"])).slice(0, 20);
    console.log("Scene 1 processed data:", data);  // Debugging statement

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.Country))
        .range([100, width - 50])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d["Total Cases"])])
        .range([height - 50, 50]);

    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.Country))
        .attr("y", d => yScale(+d["Total Cases"]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - 50 - yScale(+d["Total Cases"]))
        .attr("fill", "steelblue");

    svg.append("g")
        .attr("transform", `translate(0,${height - 50})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g")
        .attr("transform", `translate(100,0)`)
        .call(d3.axisLeft(yScale));

    // X axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "end")
        .attr("x", (width + 100) / 2)
        .attr("y", height - 10)
        .text("Country");

    // Y axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "end")
        .attr("x", -50)
        .attr("y", 20)
        .attr("transform", "rotate(-90)")
        .text("Total Cases");
}

// Scene 2: Detailed comparison of COVID-19 deaths by region
function scene2() {
    clearVisualization();
    activateButton("btn-scene2");
    if (!covidData) {
        console.error("No data available for Scene 2");
        return;
    }
    console.log("Scene 2 data:", covidData);  // Debugging statement
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    const data = Array.from(d3.group(covidData, d => d.Region), ([key, value]) => ({ key, value: d3.sum(value, d => +d["Total Deaths"]) }));
    console.log("Scene 2 processed data:", data);  // Debugging statement

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.key))
        .range([100, width - 50])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([height - 50, 50]);

    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.key))
        .attr("y", d => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - 50 - yScale(d.value))
        .attr("fill", "steelblue");

    svg.append("g")
        .attr("transform", `translate(0,${height - 50})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g")
        .attr("transform", `translate(100,0)`)
        .call(d3.axisLeft(yScale));

    // X axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "end")
        .attr("x", (width + 100) / 2)
        .attr("y", height - 10)
        .text("Region");

    // Y axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "end")
        .attr("x", -50)
        .attr("y", 20)
        .attr("transform", "rotate(-90)")
        .text("Total Deaths");
}

// Scene 3: Country-specific deep dive
function scene3() {
    clearVisualization();
    activateButton("btn-scene3");
    if (!covidData) {
        console.error("No data available for Scene 3");
        return;
    }
    console.log("Scene 3 data:", covidData);  // Debugging statement
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    const data = covidData.sort((a, b) => d3.descending(+a["Total Deaths"], +b["Total Deaths"])).slice(0, 20);
    console.log("Scene 3 processed data:", data);  // Debugging statement

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.Country))
        .range([100, width - 50])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d["Total Deaths"])])
        .range([height - 50, 50]);

    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.Country))
        .attr("y", d => yScale(+d["Total Deaths"]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - 50 - yScale(+d["Total Deaths"]))
        .attr("fill", "steelblue");

    svg.append("g")
        .attr("transform", `translate(0,${height - 50})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g")
        .attr("transform", `translate(100,0)`)
        .call(d3.axisLeft(yScale));

    // X axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "end")
        .attr("x", (width + 100) / 2)
        .attr("y", height - 10)
        .text("Country");

    // Y axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "end")
        .attr("x", -50)
        .attr("y", 20)
        .attr("transform", "rotate(-90)")
        .text("Total Deaths");
}

// Scene 4: Interactive exploration of specific countries
function scene4() {
    clearVisualization();
    activateButton("btn-scene4");
    if (!covidData) {
        console.error("No data available for Scene 4");
        return;
    }
    console.log("Scene 4 data:", covidData);  // Debugging statement
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    const data = covidData.sort((a, b) => d3.descending(+a["Total Cases"], +b["Total Cases"])).slice(0, 20);
    console.log("Scene 4 processed data:", data);  // Debugging statement

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.Country))
        .range([100, width - 50])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d["Total Cases"])])
        .range([height - 50, 50]);

    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.Country))
        .attr("y", d => yScale(+d["Total Cases"]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - 50 - yScale(+d["Total Cases"]))
        .attr("fill", "steelblue")
        .on("mouseover", function(event, d) {
            d3.select(this)
                .attr("fill", "orange");

            const [x, y] = d3.pointer(event);
            svg.append("text")
                .attr("id", "tooltip")
                .attr("x", x + 10)
                .attr("y", y - 10)
                .attr("fill", "black")
                .text(`Cases: ${d["Total Cases"]}, Deaths: ${d["Total Deaths"]}`);
        })
        .on("mouseout", function() {
            d3.select(this)
                .attr("fill", "steelblue");

            d3.select("#tooltip").remove();
        });

    svg.append("g")
        .attr("transform", `translate(0,${height - 50})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g")
        .attr("transform", `translate(100,0)`)
        .call(d3.axisLeft(yScale));

    // X axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "end")
        .attr("x", (width + 100) / 2)
        .attr("y", height - 10)
        .text("Country");

    // Y axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "end")
        .attr("x", -50)
        .attr("y", 20)
        .attr("transform", "rotate(-90)")
        .text("Total Cases");
}

// Initialize the first scene
scene1();
