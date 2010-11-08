package player

type Player struct {
	X, Y float
}

func (p *Player) Foo() string {
	return "hello"
}
