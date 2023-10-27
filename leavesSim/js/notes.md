// Did I need to calculate velocities of a leaf for this to look realistic? No.
// Did I want to? Yes, It was fun!
// Interesting drag forces article.
// https://courses.lumenlearning.com/suny-physics/chapter/5-2-drag-forces/
// I'm finding conflicting sources for leaf density.
// https://www.aqua-calc.com/page/density-table/substance/leaf-blank-green
// https://academic.oup.com/treephys/article/37/10/1337/3061235#tpx016TB3
// We will go with 5220 kg/m³
// We assume mass of leaf is 0.005kg.
// We assume the cross sectional area of a leaf is 0.58m^2
// https://www.bonsainut.com/threads/trident-maple-leaf-size-reduction.25474/
// https://www.omnicalculator.com/physics/terminal-velocity?c=USD&v=Rho:1.204!kgm3,g:9.81!mps2,m:0.005!kg,A:0.007742!m2,Cd:3.06
// This site tells me that the terminal velocity of a leaf sits at 3m/s.
// https://northernwoodlands.org/outside_story/article/maples-other-delicacy#:~:text=Dispersed%20by%20the%20wind%2C%20maple,about%20three%20miles%20per%20hour).
// https://youtu.be/17HZ75IRy7Y?t=240
// Cd = ((2)*(0.005)*(9.81))/((1.204)*0.58*Math.pow(0.254, 2))
// Cd = 2.1774444969442124 = 2.177
// This gets us to the equation for velocity.
// https://physics.stackexchange.com/questions/439294/is-there-a-way-to-calculate-the-time-taken-by-a-falling-object-to-reach-terminal#answer-439297
// 0.13656 * Math.tanh(t/TAU)