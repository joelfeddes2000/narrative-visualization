// Function to clear the current visualization
function clearVisualization() {
    d3.select("#visualization").selectAll("*").remove();
}

// Scene 1: Introduction to global COVID-19 statistics
function scene1() {
    clearVisualization();
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    // Example data to illustrate
    const data = [
        { country: "USA", cases: 94152573, deaths: 1040506 },
        { country: "India", cases: 44516479, deaths: 528250 },
        { country: "Brazil", cases: 34544377, deaths: 685002 },
        // Add more countries...
    ];

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.country))
        .range([50, width - 50])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.cases)])
        .range([height - 50, 50]);

    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.country))
        .attr("y", d => yScale(d.cases))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - 50 - yScale(d.cases))
        .attr("fill", "steelblue");

    svg.append("g")
        .attr("transform", `translate(0,${height - 50})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("transform", `translate(50,0)`)
        .call(d3.axisLeft(yScale));

    // Add annotations
    const annotations = [
        {
            note: { label: "Most cases in the USA" },
            x: xScale("USA") + xScale.bandwidth() / 2,
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

// Scene 2: Detailed comparison of cases and deaths across continents
function scene2() {
    clearVisualization();
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    // Example data to illustrate
    const data = [
        { continent: "Americas", cases: 120000000, deaths: 2300000 },
        { continent: "Europe", cases: 80000000, deaths: 2000000 },
        // Add more continents...
    ];

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.continent))
        .range([50, width - 50])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.cases)])
        .range([height - 50, 50]);

    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.continent))
        .attr("y", d => yScale(d.cases))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - 50 - yScale(d.cases))
        .attr("fill", "steelblue");

    svg.append("g")
        .attr("transform", `translate(0,${height - 50})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("transform", `translate(50,0)`)
        .call(d3.axisLeft(yScale));

    // Add annotations
    const annotations = [
        {
            note: { label: "Most cases in Americas" },
            x: xScale("Americas") + xScale.bandwidth() / 2,
            y: yScale(120000000),
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

    // Example data to illustrate
    const data = [
        { country: "USA", cases: 94152573, deaths: 1040506 },
        { country: "India", cases: 44516479, deaths: 528250 },
        // Add more countries...
    ];

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.country))
        .range([50, width - 50])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.cases)])
        .range([height - 50, 50]);

    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.country))
        .attr("y", d => yScale(d.cases))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - 50 - yScale(d.cases))
        .attr("fill", "steelblue");

    svg.append("g")
        .attr("transform", `translate(0,${height - 50})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("transform", `translate(50,0)`)
        .call(d3.axisLeft(yScale));

    // Add annotations
    const annotations = [
        {
            note: { label: "Most cases in the USA" },
            x: xScale("USA") + xScale.bandwidth() / 2,
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

// Scene 4: Interactive exploration of specific countries
function scene4() {
    clearVisualization();
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    // Example data to illustrate
    const data = [
        { country: "USA", cases: 94152573, deaths: 1040506 },
        { country: "India", cases: 44516479, deaths: 528250 },
        // Add more countries...
    ];

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.country))
        .range([50, width - 50])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.cases)])
        .range([height - 50, 50]);

    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.country))
        .attr("y", d => yScale(d.cases))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - 50 - yScale(d.cases))
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
                .text(`Cases: ${d.cases}, Deaths: ${d.deaths}`);
        })
        .on("mouseout", function() {
            d3.select(this)
                .attr("fill", "steelblue");

            d3.select("#tooltip").remove();
        });

    svg.append("g")
        .attr("transform", `translate(0,${height - 50})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("transform", `translate(50,0)`)
        .call(d3.axisLeft(yScale));
}

// Initialize the first scene
scene1();
