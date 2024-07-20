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
        "btn-cases-region",
        "btn-deaths-country",
        "btn-cases-country"
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
        .attr("width", covidData.length * 50) // Set width based on the number of countries
        .attr("height", window.innerHeight - 150); // Set height based on the window's inner height

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    const margin = { top: 20, right: 30, bottom: 150, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const data = covidData.sort((a, b) => d3.descending(+a["Total Cases"], +b["Total Cases"]));
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
    g.append("line")
        .attr("x1", xScale(data[0].Country) + xScale.bandwidth() / 2)
        .attr("y1", yScale(data[0]["Total Cases"]))
        .attr("x2", xScale(data[0].Country) + xScale.bandwidth() / 2)
        .attr("y2", yScale(data[0]["Total Cases"]) - 50)
        .attr("stroke", "red")
        .attr("stroke-width", 2);

    g.append("text")
        .attr("x", xScale(data[0].Country) + xScale.bandwidth() / 2 + 5)
        .attr("y", yScale(data[0]["Total Cases"]) - 55)
        .attr("text-anchor", "start")
        .attr("fill", "red")
        .attr("font-size", "12px")
        .text("US has more than double the cases of any other country");
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

    const margin = { top: 20, right: 30, bottom: 150, left: 100 };
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
}

// Scene 3: Cases x Region
function scene3() {
    clearVisualization();
    activateButton("btn-cases-region");
    showNextButton("btn-cases-region");
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

    const margin = { top: 20, right: 30, bottom: 150, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    let data = Array.from(d3.group(covidData, d => d.Region), ([key, value]) => ({ key, value: d3.sum(value, d => +d["Total Cases"]) }));
    data = data.sort((a, b) => d3.descending(a.value, b.value)); // Sort data by Total Cases
    console.log("Scene 3 processed data:", data);  // Debugging statement

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
                .text(`Cases: ${d.value}`);
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
        .text("Total Cases");

    // Annotation
    g.append("line")
        .attr("x1", xScale("Americas") + xScale.bandwidth() / 2)
        .attr("y1", yScale(data.find(d => d.key === "Americas").value))
        .attr("x2", xScale("Europe") + xScale.bandwidth() / 2)
        .attr("y2", yScale(data.find(d => d.key === "Europe").value))
        .attr("stroke", "red")
        .attr("stroke-width", 2);

    g.append("text")
        .attr("x", (xScale("Americas") + xScale("Europe")) / 2)
        .attr("y", Math.min(yScale(data.find(d => d.key === "Americas").value), yScale(data.find(d => d.key === "Europe").value)) - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "red")
        .attr("font-size", "12px")
        .text("America had 35.5% more deaths then but had 41.2% less cases when compared to Europe");
}

// Scene 4: Deaths x Country
function scene4() {
    clearVisualization();
    activateButton("btn-deaths-country");
    showNextButton("btn-deaths-country");
    if (!covidData) {
        console.error("No data available for Scene 4");
        return;
    }
    console.log("Scene 4 data:", covidData);  // Debugging statement

    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", covidData.length * 50) // Set width based on the number of countries
        .attr("height", window.innerHeight - 150); // Set height based on the window's inner height

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    const margin = { top: 20, right: 30, bottom: 150, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const data = covidData.sort((a, b) => d3.descending(+a["Total Deaths"], +b["Total Deaths"]));
    console.log("Scene 4 processed data:", data);  // Debugging statement

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
}

// Initialize the first scene
scene2();
