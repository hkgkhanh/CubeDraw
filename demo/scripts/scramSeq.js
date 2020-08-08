
const y = "#D7DF01";
const w = "#FFFFFF";
const r = "#FF0000";
const o = "#FF8000";
const b = "#0000FF";
const g = "#00FF00";

function getSequence(e, s) {
	let seq = [];

	for (let i = 0; i < s.length; i++) {
		seq.push(s[i]);
	}
	seq.push(" ");

	for (let i = seq.length-1; i > 0; i--) {
		if (seq[i] == "w") {
			if (seq[i-1] == "F") {
				seq[i-1] = "f";
			} else if (seq[i-1] == "U") {
				seq[i-1] = "u";
			} else if (seq[i-1] == "R") {
				seq[i-1] = "r";
			}
			seq.splice(i, 1);
		}
	}

	if (e == "4") {
		
		for (let i = 1; i < seq.length-1; i++) {
			if (seq[i] == "'") {
				seq[i] = seq[i-1];
				seq[i+1] = seq[i-1];
			}
			if (seq[i] == "2") {
				seq[i] = seq[i-1];
			}
		}
		
	} else if (e == "3") {
		for (let i = 1; i < seq.length-1; i++) {
			if (seq[i] == "'") {
				seq[i] = s[i-1];
			}
		}
	}

	for (let i = seq.length-1; i >= 0; i--) {
		if (seq[i] == " ") {
			seq.splice(i, 1);
		}
	}

	return seq.join("");
}

function initCubeArr(c) {

	if (c == "222") {
		for (let i = 0; i < cube2[0].length; i++) {
			cube2[0][i] = w;
		}
		for (let i = 0; i < cube2[1].length; i++) {
			cube2[1][i] = o;
		}
		for (let i = 0; i < cube2[2].length; i++) {
			cube2[2][i] = g;
		}
		for (let i = 0; i < cube2[3].length; i++) {
			cube2[3][i] = r;
		}
		for (let i = 0; i < cube2[4].length; i++) {
			cube2[4][i] = b;
		}
		for (let i = 0; i < cube2[5].length; i++) {
			cube2[5][i] = y;
		}
	} else if (c == "skb") {
		for (let i = 0; i < cubeS[0].length; i++) {
			cubeS[0][i] = w;
		}
		for (let i = 0; i < cubeS[1].length; i++) {
			cubeS[1][i] = o;
		}
		for (let i = 0; i < cubeS[2].length; i++) {
			cubeS[2][i] = g;
		}
		for (let i = 0; i < cubeS[3].length; i++) {
			cubeS[3][i] = r;
		}
		for (let i = 0; i < cubeS[4].length; i++) {
			cubeS[4][i] = b;
		}
		for (let i = 0; i < cubeS[5].length; i++) {
			cubeS[5][i] = y;
		}
	} else if (c == "pyram") {
		for (let i = 0; i < cubeP[0].length; i++) {
			cubeP[0][i] = r;
		}
		for (let i = 0; i < cubeP[1].length; i++) {
			cubeP[1][i] = g;
		}
		for (let i = 0; i < cubeP[2].length; i++) {
			cubeP[2][i] = b;
		}
		for (let i = 0; i < cubeP[3].length; i++) {
			cubeP[3][i] = y;
		}
	} else if (c == "333") {
		for (let i = 0; i < cube3[0].length; i++) {
			cube3[0][i] = w;
		}
		for (let i = 0; i < cube3[1].length; i++) {
			cube3[1][i] = o;
		}
		for (let i = 0; i < cube3[2].length; i++) {
			cube3[2][i] = g;
		}
		for (let i = 0; i < cube3[3].length; i++) {
			cube3[3][i] = r;
		}
		for (let i = 0; i < cube3[4].length; i++) {
			cube3[4][i] = b;
		}
		for (let i = 0; i < cube3[5].length; i++) {
			cube3[5][i] = y;
		}
	}
}