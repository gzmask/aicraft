package player

type Player struct {
	X,Y int
}

func (p *Player) Foo() string {
	return "hello"
}
