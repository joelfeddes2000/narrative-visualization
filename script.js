let covidData;

// Load the dataset from the GitHub repository
d3.csv("https://raw.githubusercontent.com/joelfeddes2000/narrative-visualization/gh-pages/covid%2019%20CountryWise.csv").then(data => {
    covidData = data;
    // Initialize the first scene
    scene1();
});

function clearVisualization() {
    d3.select("#visualization").selectAll("*").remove();
}

// Scene 1: Introduction to global COVID-19 statistics by country
function scene1() {
    clearVisualization();
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    const data = covidData.sort((a, b) => d3.descending(+a["Total Cases"], +b["Total Cases"])).slice(0, 20);

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

    // Add annotations
    const annotations = [
        {
            note: { label: "Most cases in the USA" },
            x: xScale("United States of America") + xScale.bandwidth() / 2,
            y: yScale(94152573),
            dy: -10,
            dx: 50
        }
    ];

    const makeAnnotations = d3.annotation()
        .type(d3.annotationLabel)
        .annotations(annotations);

    svg.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);
}

// Scene 2: Detailed comparison of COVID-19 deaths by region
function scene2() {
    clearVisualization();
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    const data = d3.nest()
        .key(d => d.Region)
        .rollup(v => d3.sum(v, d => +d["Total Deaths"]))
        .entries(covidData);

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

    // Add annotations
    const annotations = [
        {
            note: { label: "Most deaths in the Americas" },
            x: xScale("Americas") + xScale.bandwidth() / 2,
            y: yScale(d3.sum(covidData.filter(d => d.Region === "Americas"), d => +d["Total Deaths"])),
            dy: -10,
            dx: 50
        }
    ];

    const makeAnnotations = d3.annotation()
        .type(d3.annotationLabel)
        .annotations(annotations);

    svg.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);
}

// Scene 3: Country-specific deep dive
function scene3() {
    clearVisualization();
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    const data = covidData.sort((a, b) => d3.descending(+a["Total Deaths"], +b["Total Deaths"])).slice(0, 20);

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

    // Add annotations
    const annotations = [
        {
            note: { label: "Most deaths in the USA" },
            x: xScale("United States of America") + xScale.bandwidth() / 2,
            y: yScale(1040506),
            dy: -10,
            dx: 50
        }
    ];

    const makeAnnotations = d3.annotation()
        .type(d3.annotationLabel)
        .annotations(annotations);

    svg.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);
}

// Scene 4: Interactive exploration of specific countries
function scene4() {
    clearVisualization();
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    const data = covidData.sort((a, b) => d3.descending(+a["Total Cases"], +b["Total Cases"])).slice(0, 20);

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
}

// Initialize the first scene
scene1();