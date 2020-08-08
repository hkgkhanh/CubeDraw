
var cube2 = [[w, w, w, w], [o, o, o, o], [g, g, g, g], [r, r, r, r], [b, b, b, b], [y, y, y, y]];

/*      u1 u2
	     u3 u4

l1 l2   f1 f2   r1 r2   b1 b2
l3 l4   f3 f4   r3 r4   b3 b4

        d1 d2
        d3 d4
*/

function drawCube2(scram) {
	initCubeArr("222");

	let scr = getSequence("4", scram);
	let temp;

	for (let i = 0; i < scr.length; i++) {
		switch (scr[i]) {
			case "R":
				temp = cube2[0][3];
				cube2[0][3] = cube2[2][3];
				cube2[2][3] = cube2[5][3];
				cube2[5][3] = cube2[4][0];
				cube2[4][0] = temp;

				temp = cube2[0][1];
				cube2[0][1] = cube2[2][1];
				cube2[2][1] = cube2[5][1];
				cube2[5][1] = cube2[4][2];
				cube2[4][2] = temp;

				temp = cube2[3][0];
				cube2[3][0] = cube2[3][2];
				cube2[3][2] = cube2[3][3];
				cube2[3][3] = cube2[3][1];
				cube2[3][1] = temp;
				break;

			case "U":
				temp = cube2[0][0];
				cube2[0][0] = cube2[0][2];
				cube2[0][2] = cube2[0][3];
				cube2[0][3] = cube2[0][1];
				cube2[0][1] = temp;

				temp = cube2[2][0];
				cube2[2][0] = cube2[3][0];
				cube2[3][0] = cube2[4][0];
				cube2[4][0] = cube2[1][0];
				cube2[1][0] = temp;

				temp = cube2[2][1];
				cube2[2][1] = cube2[3][1];
				cube2[3][1] = cube2[4][1];
				cube2[4][1] = cube2[1][1];
				cube2[1][1] = temp;
				break;

			case "F":
				temp = cube2[2][0];
				cube2[2][0] = cube2[2][2];
				cube2[2][2] = cube2[2][3];
				cube2[2][3] = cube2[2][1];
				cube2[2][1] = temp;

				temp = cube2[0][2];
				cube2[0][2] = cube2[1][3];
				cube2[1][3] = cube2[5][1];
				cube2[5][1] = cube2[3][0];
				cube2[3][0] = temp;

				temp = cube2[0][3];
				cube2[0][3] = cube2[1][1];
				cube2[1][1] = cube2[5][0];
				cube2[5][0] = cube2[3][2];
				cube2[3][2] = temp;
				break;
		}
	}
	document.getElementById("222_U1").style.fill = cube2[0][0];
	document.getElementById("222_U2").style.fill = cube2[0][1];
	document.getElementById("222_U3").style.fill = cube2[0][2];
	document.getElementById("222_U4").style.fill = cube2[0][3];
	document.getElementById("222_L1").style.fill = cube2[1][0];
	document.getElementById("222_L2").style.fill = cube2[1][1];
	document.getElementById("222_L3").style.fill = cube2[1][2];
	document.getElementById("222_L4").style.fill = cube2[1][3];
	document.getElementById("222_F1").style.fill = cube2[2][0];
	document.getElementById("222_F2").style.fill = cube2[2][1];
	document.getElementById("222_F3").style.fill = cube2[2][2];
	document.getElementById("222_F4").style.fill = cube2[2][3];
	document.getElementById("222_R1").style.fill = cube2[3][0];
	document.getElementById("222_R2").style.fill = cube2[3][1];
	document.getElementById("222_R3").style.fill = cube2[3][2];
	document.getElementById("222_R4").style.fill = cube2[3][3];
	document.getElementById("222_B1").style.fill = cube2[4][0];
	document.getElementById("222_B2").style.fill = cube2[4][1];
	document.getElementById("222_B3").style.fill = cube2[4][2];
	document.getElementById("222_B4").style.fill = cube2[4][3];
	document.getElementById("222_D1").style.fill = cube2[5][0];
	document.getElementById("222_D2").style.fill = cube2[5][1];
	document.getElementById("222_D3").style.fill = cube2[5][2];
	document.getElementById("222_D4").style.fill = cube2[5][3];
}