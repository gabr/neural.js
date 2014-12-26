function node (number_of_inputs) {
	this.id = node.prototype.count++;
	this.weights = new Array(number_of_inputs + 1); // 1 for stable signal weight

	// fill weights with ones
	for (var i = 0; i < this.weights.length; i++) {
		this.weights[i] = 1;
	}

	function activation_function(weighted_sum, function_name, beta) {

		// default parameters values
		function_name = typeof function_name !== 'undefined' ? function_name : "linear";
		beta = typeof beta !== 'undefined' ? beta : 10;

		switch (function_name) {
			case "linear":
				return weighted_sum;

			case "linear_truncated":
				if (weighted_sum < -1)
					return -1;
				else if (weighted_sum > 1)
					return 1;
				else
					return weighted_sum;

			case "unipolar_threshold":
				if (weighted_sum < 0)
					return 0;
				else
					return 1;

			case "bipolar_threshold":
				if (weighted_sum < 0)
					return -1;
				else
					return 1;

			case "unipolar_sigmoidal":
				return 1 / (1 + Math.exp(-beta * weighted_sum));

			case "bipolar_sigmoidal":
				return (2 / (1 + Math.exp(-beta * weighted_sum))) - 1;

			case "hyperbolic":
				return (1 - Math.exp(-beta * weighted_sum)) / (1 + Math.exp(-beta * weighted_sum));
		}

		return weighted_sum;
	};

	this.calculate_output = function(inputs) {
		var output = this.weights[this.weights.length - 1];

		for (var i = 0; i < inputs.length; i++) {
			output += inputs[i] * this.weights[i];
		}

		return activation_function(output, "bipolar_threshold");
	};
};

node.prototype.count = 0;

function train(neural_node, training_set) {
	training_set.forEach(function (training_data) {
		if (neural_node.calculate_output(training_data.inputs) != training_data.result) {
			debugger;
			// recalculate weights
			for (var i = 0; i < training_data.inputs.length; i++) {
				neural_node.weights[i] += training_data.inputs[i] * 2 * training_data.result;
			}

			neural_node.weights[neural_node.weights.length - 1] += 2 * training_data.result;
		}
	});
}

var n1 = new node(1);
n1.weights = [3, 1];

var training_set = [
{inputs: [-4], result: -1},
{inputs: [-1], result: 1},
{inputs: [1], result: 1},
{inputs: [3], result: 1}];

train(n1, training_set);

training_set.forEach(function (t) {
	console.log(t);
	console.log(" --> " + n1.calculate_output(t.inputs));
});

module.exports = {
	node: node,
	train: train
};