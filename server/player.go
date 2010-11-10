package player

type Player struct {
	X,Y int
	Name string
}

func (p *Player) Foo() string {
	return "hello"
}
