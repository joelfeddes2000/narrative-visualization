let covidData;

// Load the dataset from the GitHub repository
d3.csv("https://raw.githubusercontent.com/joelfeddes2000/narrative-visualization/gh-pages/covid19countrywise.csv").then(data => {
    console.log("Data loaded:", data);  // Debugging statement
    covidData = data;
    // Initialize the first scene
    scene2();
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

function showNextButton(currentButtonId) {
    const buttons = [
        "btn-deaths-region",
        "btn-deaths-country",
        "btn-cases-country",
        "btn-cases-country-details"
    ];
    const currentIndex = buttons.indexOf(currentButtonId);
    if (currentIndex >= 0 && currentIndex < buttons.length - 1) {
        const nextButtonId = buttons[currentIndex + 1];
        document.getElementById(nextButtonId).style.display = "inline-block";
    }
}

// Scene 1: Cases x Country
function scene1() {
    clearVisualization();
    activateButton("btn-cases-country");
    showNextButton("btn-cases-country");
    if (!covidData) {
        console.error("No data available for Scene 1");
        return;
    }
    console.log("Scene 1 data:", covidData);  // Debugging statement
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", window.innerWidth - 50) // Set width based on the window's inner width
        .attr("height", window.innerHeight - 150); // Set height based on the window's inner height

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    const margin = { top: 20, right: 30, bottom: 150, left: 100 }; // Increase the bottom margin
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const data = covidData.sort((a, b) => d3.descending(+a["Total Cases"], +b["Total Cases"])).slice(0, 20);
    console.log("Scene 1 processed data:", data);  // Debugging statement

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

    // Annotations
    g.append("text")
        .attr("x", xScale(data[0].Country) + xScale.bandwidth() / 2)
        .attr("y", yScale(data[0]["Total Cases"]) - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .attr("transform", "rotate(-90)")
        .text("Highest: US\n>2x any other country");
}

// Scene 2: Deaths x Region
function scene2() {
    clearVisualization();
    activateButton("btn-deaths-region");
    showNextButton("btn-deaths-region");
    if (!covidData) {
        console.error("No data available for Scene 2");
        return;
    }
    console.log("Scene 2 data:", covidData);  // Debugging statement
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", window.innerWidth - 50) // Set width based on the window's inner width
        .attr("height", window.innerHeight - 150); // Set height based on the window's inner height

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    const margin = { top: 20, right: 30, bottom: 150, left: 100 }; // Increase the bottom margin
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    let data = Array.from(d3.group(covidData, d => d.Region), ([key, value]) => ({ key, value: d3.sum(value, d => +d["Total Deaths"]) }));
    data = data.sort((a, b) => d3.descending(a.value, b.value)); // Sort data by Total Deaths
    console.log("Scene 2 processed data:", data);  // Debugging statement

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
                .text(`Deaths: ${d.value}`);
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
        .text("Region");

    // Y axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", -(margin.top + innerHeight / 2))
        .attr("y", 20)
        .attr("transform", "rotate(-90)")
        .text("Total Deaths");

    // Annotations
    g.append("text")
        .attr("x", xScale(data[0].key) + xScale.bandwidth() / 2)
        .attr("y", yScale(data[0].value) - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .attr("transform", "rotate(-90)")
        .text("Highest: Americas");
}

// Scene 3: Deaths x Country
function scene3() {
    clearVisualization();
    activateButton("btn-deaths-country");
    showNextButton("btn-deaths-country");
    if (!covidData) {
        console.error("No data available for Scene 3");
        return;
    }
    console.log("Scene 3 data:", covidData);  // Debugging statement
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", window.innerWidth - 50) // Set width based on the window's inner width
        .attr("height", window.innerHeight - 150); // Set height based on the window's inner height

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    const margin = { top: 20, right: 30, bottom: 150, left: 100 }; // Increase the bottom margin
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const data = covidData.sort((a, b) => d3.descending(+a["Total Deaths"], +b["Total Deaths"])).slice(0, 20);
    console.log("Scene 3 processed data:", data);  // Debugging statement

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
                .text(`Deaths: ${d["Total Deaths"]}`);
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
        .text("Total Deaths");

    // Annotations
    g.append("text")
        .attr("x", xScale(data[0].Country) + xScale.bandwidth() / 2)
        .attr("y", yScale(data[0]["Total Deaths"]) - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .attr("transform", "rotate(-90)")
        .text("Highest: US");
}

// Scene 4: Cases x Country Details
function scene4() {
    clearVisualization();
    activateButton("btn-cases-country-details");
    showNextButton("btn-cases-country-details");
    if (!covidData) {
        console.error("No data available for Scene 4");
        return;
    }
    console.log("Scene 4 data:", covidData);  // Debugging statement
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", window.innerWidth - 50) // Set width based on the window's inner width
        .attr("height", window.innerHeight - 150); // Set height based on the window's inner height

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    const margin = { top: 20, right: 30, bottom: 150, left: 100 }; // Increase the bottom margin
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const data = covidData.sort((a, b) => d3.descending(+a["Total Cases"], +b["Total Cases"])).slice(0, 20);
    console.log("Scene 4 processed data:", data);  // Debugging statement

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

    // Annotations
    g.append("text")
        .attr("x", xScale(data[0].Country) + xScale.bandwidth() / 2)
        .attr("y", yScale(data[0]["Total Cases"]) - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .attr("transform", "rotate(-90)")
        .text("Highest: US\n>2x any other country");
}

// Initialize the first scene
scene2();
